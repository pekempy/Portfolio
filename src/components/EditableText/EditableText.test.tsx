
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditableText } from './index';
import { MantineProvider } from '@mantine/core';
import { useContent } from '../../context/ContentContext';
import React from 'react';

vi.mock('../../context/ContentContext', async () => {
    const actual = await vi.importActual('../../context/ContentContext');
    return {
        ...actual,
        useContent: vi.fn(),
    };
});

const mockUpdateContent = vi.fn();
const mockBulkUpdate = vi.fn();

const defaultContent = {
    'home.title': { text: 'Welcome Home', style: {} }
};

const renderWithMantine = (component: React.ReactNode) => {
    return render(
        <MantineProvider>
            {component}
        </MantineProvider>
    );
};

describe('EditableText Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useContent).mockReturnValue({
            content: defaultContent,
            updateContent: mockUpdateContent,
            bulkUpdate: mockBulkUpdate,
            isEditable: false,
        } as unknown as ReturnType<typeof useContent>);
    });

    it('renders text content correctly in read-only mode', () => {
        renderWithMantine(<EditableText contentKey="home.title" defaultValue="Default Title" />);
        expect(screen.getByText('Welcome Home')).toBeInTheDocument();
    });

    it('uses defaultValue if contentKey is missing', () => {
        vi.mocked(useContent).mockReturnValue({
            content: {},
            updateContent: mockUpdateContent,
            bulkUpdate: mockBulkUpdate,
            isEditable: false,
        } as unknown as ReturnType<typeof useContent>);
        renderWithMantine(<EditableText contentKey="missing.key" defaultValue="Fallback" />);
        expect(screen.getByText('Fallback')).toBeInTheDocument();
    });

    it('shows edit tooltip and icon in editable mode', async () => {
        vi.mocked(useContent).mockReturnValue({
            content: defaultContent,
            updateContent: mockUpdateContent,
            bulkUpdate: mockBulkUpdate,
            isEditable: true,
        } as unknown as ReturnType<typeof useContent>);

        renderWithMantine(<EditableText contentKey="home.title" defaultValue="Title" />);
        expect(screen.getByText('Welcome Home')).toBeInTheDocument();

        const textElement = screen.getByText('Welcome Home');
        fireEvent.click(textElement);

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: "Edit text content" })).toHaveValue('Welcome Home');
        });
    });

    it('updates content on save', async () => {
        vi.mocked(useContent).mockReturnValue({
            content: defaultContent,
            updateContent: mockUpdateContent,
            bulkUpdate: mockBulkUpdate,
            isEditable: true,
        } as unknown as ReturnType<typeof useContent>);

        renderWithMantine(<EditableText contentKey="home.title" defaultValue="Title" />);

        fireEvent.click(screen.getByText('Welcome Home'));

        await waitFor(() => {
            screen.getByRole('textbox', { name: "Edit text content" });
        });
        const input = screen.getByRole('textbox', { name: "Edit text content" });
        fireEvent.change(input, { target: { value: 'New World' } });

        const saveBtn = screen.getByRole('button', { name: /save changes/i });
        fireEvent.click(saveBtn);

        expect(mockUpdateContent).toHaveBeenCalledWith('home.title', expect.objectContaining({
            text: 'New World'
        }));
    });
});
