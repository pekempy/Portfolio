import { Container, Title, Image, Box, Modal, ActionIcon } from '@mantine/core';
import { motion } from 'framer-motion';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useState } from 'react';

import { EditableText } from '../components/EditableText';
import { EditableList, type ListItem } from '../components/EditableList';
import { useContent } from '../context/ContentContext';
import { MasonryGrid } from '../components/MasonryGrid';

const defaultGalleryImages = [
    { _id: '1', title: 'Image 1', src: '/about.png' },
    { _id: '2', title: 'Image 2', src: '/hero.png' },
    { _id: '3', title: 'Image 3', src: '/about.png' },
    { _id: '4', title: 'Image 4', src: '/hero.png' },
    { _id: '5', title: 'Image 5', src: '/hero.png' },
    { _id: '6', title: 'Image 6', src: '/about.png' },
];

export function Gallery() {
    const { content } = useContent();
    const galleryItems = (content['gallery.items'] as ListItem[]) || defaultGalleryImages;

    const projectGalleryItems = Object.keys(content)
        .filter(key => key.startsWith('work.project.') && key.endsWith('.gallery'))
        .flatMap(key => (content[key] as ListItem[] || []).map(item => ({ ...item, _isProject: true })));

    const allGalleryItems = [...galleryItems, ...projectGalleryItems];

    const [opened, { open, close }] = useDisclosure(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        open();
    };

    const nextImage = () => {
        setSelectedIndex((current) => (current + 1) % allGalleryItems.length);
    };

    const prevImage = () => {
        setSelectedIndex((current) => (current - 1 + allGalleryItems.length) % allGalleryItems.length);
    };

    useHotkeys([
        ['ArrowRight', nextImage],
        ['ArrowLeft', prevImage],
        ['Escape', close],
    ]);

    return (
        <Container size="xl" py="xl" mt="xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <Title order={1} mb={50} ta="center" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <EditableText contentKey="gallery.title" defaultValue="Gallery" />
                </Title>

                <EditableList
                    contentKey="gallery.items"
                    defaultItems={defaultGalleryImages}
                    title="Gallery Images"
                    appendItems={null}
                    renderItem={() => null}
                />

                <Box>
                    <MasonryGrid
                        items={allGalleryItems}
                        onItemClick={(index) => handleImageClick(index)}
                    />
                </Box>
            </motion.div>

            {allGalleryItems.length > 0 && (
                <Modal
                    opened={opened}
                    onClose={close}
                    fullScreen
                    withCloseButton={false}
                    padding={0}
                    styles={{
                        content: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
                        body: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                    }}
                    onClick={close}
                >
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={(e) => { e.stopPropagation(); close(); }}
                        size="xl"
                        style={{ position: 'absolute', top: 60, right: 20, zIndex: 1000 }}
                    >
                        <IconX size={32} />
                    </ActionIcon>

                    <ActionIcon
                        variant="transparent"
                        color="gray"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        size="xl"
                        style={{ position: 'absolute', left: 20, zIndex: 1000 }}
                    >
                        <IconChevronLeft size={48} />
                    </ActionIcon>

                    <Image
                        src={allGalleryItems[selectedIndex]?.src}
                        onClick={(e) => e.stopPropagation()}
                        decoding="async"
                        style={{
                            maxHeight: '90vh',
                            maxWidth: '90vw',
                            objectFit: 'contain'
                        }}
                    />

                    <ActionIcon
                        variant="transparent"
                        color="gray"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        size="xl"
                        style={{ position: 'absolute', right: 20, zIndex: 1000 }}
                    >
                        <IconChevronRight size={48} />
                    </ActionIcon>
                </Modal>
            )}
        </Container>
    );
}
