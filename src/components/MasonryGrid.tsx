import { Image, Box, Stack, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mantine/hooks';
import { type ListItem } from './EditableList';

interface MasonryGridProps {
    items: ListItem[];
    onItemClick?: (index: number) => void;
}

export function MasonryGrid({ items, onItemClick }: MasonryGridProps) {
    const isMobile = useMediaQuery('(max-width: 48em)');
    const isTablet = useMediaQuery('(max-width: 64em)');

    return (
        <Group align="flex-start" gap="xl" wrap="nowrap">
            {[...Array(isMobile ? 1 : isTablet ? 2 : 3)].map((_, colIndex) => {
                const columnItems = items.filter((_, index) => index % (isMobile ? 1 : isTablet ? 2 : 3) === colIndex);
                return (
                    <Stack key={colIndex} gap="xl" style={{ flex: 1 }}>
                        {columnItems.map((item, index) => {
                            // Find original index for click handler
                            const originalIndex = items.indexOf(item);
                            const isPortrait = item.orientation === 'portrait';

                            return (
                                <motion.div
                                    key={item._id || index}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box
                                        style={{ overflow: 'hidden', borderRadius: '4px', cursor: 'zoom-in' }}
                                        onClick={() => onItemClick && onItemClick(originalIndex)}
                                    >
                                        <Image
                                            src={item.src}
                                            radius="md"
                                            w="100%"
                                            h="auto"
                                            style={{
                                                aspectRatio: isPortrait ? '3/4' : '4/3',
                                                objectFit: 'cover',
                                                objectPosition: (item.objectPosition as string) || 'center',
                                                transition: 'filter 0.3s'
                                            }}
                                            onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => e.currentTarget.style.filter = 'brightness(1.1)'}
                                            onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => e.currentTarget.style.filter = 'brightness(1)'}
                                        />
                                    </Box>
                                </motion.div>
                            );
                        })}
                    </Stack>
                );
            })}
        </Group>
    );
}
