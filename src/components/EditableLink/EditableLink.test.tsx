
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditableLink } from './index';
import { MantineProvider } from '@mantine/core';
import { useContent } from '../../context/ContentContext';
import React from 'react';

// Mock the context
vi.mock('../../context/ContentContext', async () => {
    const actual = await vi.importActual('../../context/ContentContext');
    return {
        ...actual,
        useContent: vi.fn(),
    };
});

const mockUpdateContent = vi.fn();
const defaultContent = {
    'footer.link1': {
        icon: 'twitter',
        url: 'https://twitter.com',
        style: {}
    }
};

const renderWithMantine = (component: React.ReactNode) => {
    return render(
        <MantineProvider>
            {component}
        </MantineProvider>
    );
};

describe('EditableLink Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementation
        vi.mocked(useContent).mockReturnValue({
            content: defaultContent,
            updateContent: mockUpdateContent,
            bulkUpdate: vi.fn(),
            isEditable: false,
        } as unknown as ReturnType<typeof useContent>);
    });

    it('renders correct icon and link in read-only mode', () => {
        renderWithMantine(
            <EditableLink
                contentKey="footer.link1"
                defaultIcon="facebook"
                defaultUrl="https://facebook.com"
            />
        );

        // Should find link with correct url from content (twitter), not default (facebook)
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://twitter.com');

        // We can't easily check for the SVG icon content without complex selectors, 
        // but checking the href confirms it loaded the content item.
    });

    it('uses defaults when content is missing', () => {
        vi.mocked(useContent).mockReturnValue({
            content: {},
            updateContent: mockUpdateContent,
            bulkUpdate: vi.fn(),
            isEditable: false,
        } as unknown as ReturnType<typeof useContent>);

        renderWithMantine(
            <EditableLink
                contentKey="missing.key"
                defaultIcon="facebook"
                defaultUrl="https://facebook.com"
            />
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://facebook.com');
    });

    it('shows edit popover when clicked in editable mode', async () => {
        vi.mocked(useContent).mockReturnValue({
            content: defaultContent,
            updateContent: mockUpdateContent,
            bulkUpdate: vi.fn(),
            isEditable: true,
        } as unknown as ReturnType<typeof useContent>);

        const { container } = renderWithMantine(
            <EditableLink
                contentKey="footer.link1"
                defaultIcon="twitter"
                defaultUrl="http://x.com"
            />
        );

        // Click the wrapper
        fireEvent.click(container.firstElementChild!);

        // Wait for and verify popover content
        expect(await screen.findByText('LINK SETTINGS')).toBeInTheDocument();
        expect(await screen.findByLabelText('Target URL')).toHaveValue('https://twitter.com');
    });

    it('updates link on save', async () => {
        vi.mocked(useContent).mockReturnValue({
            content: defaultContent,
            updateContent: mockUpdateContent,
            bulkUpdate: vi.fn(),
            isEditable: true,
        } as unknown as ReturnType<typeof useContent>);

        const { container } = renderWithMantine(
            <EditableLink
                contentKey="footer.link1"
                defaultIcon="twitter"
                defaultUrl="http://x.com"
            />
        );

        fireEvent.click(container.firstElementChild!);

        const input = await screen.findByLabelText('Target URL');
        fireEvent.change(input, { target: { value: 'https://new-url.com' } });

        const saveBtn = screen.getByRole('button', { name: "Save" });
        fireEvent.click(saveBtn);

        expect(mockUpdateContent).toHaveBeenCalledWith('footer.link1', expect.objectContaining({
            url: 'https://new-url.com',
            icon: 'twitter'
        }));
    });
});
