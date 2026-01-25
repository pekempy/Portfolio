import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
    colors: {
        gold: [
            '#FBF9F2',
            '#F4F0DE',
            '#EBE2BC',
            '#E2D396',
            '#DBC674',
            '#D5BB57',
            '#D1B548',
            '#B59C38',
            '#A08930',
            '#8A7628',
        ],
        dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5C5F66',
            '#373A40',
            '#2C2E33',
            '#25262B',
            '#1A1B1E',
            '#141517',
            '#101113',
        ],
    },
    primaryColor: 'gold',
    primaryShade: 5,
    fontFamily: '"Outfit", "Inter", sans-serif',
    headings: {
        fontFamily: '"Playfair Display", serif',
        sizes: {
            h1: { fontSize: rem(64), lineHeight: '1.2' },
            h2: { fontSize: rem(48), lineHeight: '1.3' },
        },
    },
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
                variant: 'filled',
            },
        },
    },
});
