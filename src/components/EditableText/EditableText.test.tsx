
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditableText } from './index';
import { MantineProvider } from '@mantine/core';
import { useContent } from '../../context/ContentContext';
import React from 'react';

// Mock the context module
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
        // Default mock implementation
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
        // Should not have the edit icon or be clickable in a way that opens popover (implementation detail, but check logic)
        // In read-only, it just renders the component (Text by default)
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

        // Check if the Text component has the pointer cursor style or class indicating interactivity
        // Or check for the IconPencil which is rendered conditionally
        // Note: IconPencil might be hidden or styled, but it should be in the DOM

        // "Welcome Home" should be there
        expect(screen.getByText('Welcome Home')).toBeInTheDocument();

        // We can interact
        const textElement = screen.getByText('Welcome Home');
        fireEvent.click(textElement);

        // Expect Popover to open -> Textarea with value
        // The Textarea inside Popover might take a moment or be immediate
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

        // Open editor
        fireEvent.click(screen.getByText('Welcome Home'));

        // Change text
        await waitFor(() => {
            screen.getByRole('textbox', { name: "Edit text content" });
        });
        const input = screen.getByRole('textbox', { name: "Edit text content" });
        fireEvent.change(input, { target: { value: 'New World' } });

        // Save
        const saveBtn = screen.getByRole('button', { name: /save changes/i });
        fireEvent.click(saveBtn);

        expect(mockUpdateContent).toHaveBeenCalledWith('home.title', expect.objectContaining({
            text: 'New World'
        }));
    });
});
