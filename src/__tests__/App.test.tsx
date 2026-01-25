import { describe, it, vi, beforeEach, type Mock } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ContentProvider } from '../context/ContentContext';
import { theme } from '../theme';
import App from '../App';

globalThis.fetch = vi.fn();

describe('App', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
    });

    it('renders without crashing', () => {
        render(
            <MantineProvider theme={theme}>
                <ContentProvider>
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </ContentProvider>
            </MantineProvider>
        );
    });
});
