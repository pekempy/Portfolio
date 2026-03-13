import { Container, Title, Text, Image, Box, Grid, ActionIcon, Modal, Group } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EditableText } from '../components/EditableText';
import { EditableList, type ListItem } from '../components/EditableList';
import { MasonryGrid } from '../components/MasonryGrid';
import { EditableParagraphs } from '../components/EditableParagraphs';
import { useContent } from '../context/ContentContext';
import { IconChevronLeft, IconChevronRight, IconX, IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';

export function WorkDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { content } = useContent();

    const projectKeyBase = `work.project.${slug}`;

    const [opened, { open, close }] = useDisclosure(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const galleryItems = (content[`${projectKeyBase}.gallery`] as ListItem[]) || [];

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        open();
    };

    const nextImage = () => {
        setSelectedIndex((current) => (current + 1) % galleryItems.length);
    };

    const prevImage = () => {
        setSelectedIndex((current) => (current - 1 + galleryItems.length) % galleryItems.length);
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
                <Box mb="xl">
                    <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => navigate('/work')}>
                        <IconArrowLeft size={16} />
                        <EditableText contentKey="work.detail.back_label" defaultValue="BACK TO WORK" as={Text} size="sm" fw={500} />
                    </Group>
                </Box>

                <Grid gutter={50}>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Title order={1} mb="xs" style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem' }}>
                            <EditableText
                                contentKey={`${projectKeyBase}.title`}
                                styleKey="work.detail.title"
                                defaultValue="Project Title"
                            />
                        </Title>
                        <Title order={3} c="gold" mb="xs" style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
                            <EditableText
                                contentKey={`${projectKeyBase}.subtitle`}
                                styleKey="work.detail.subtitle"
                                defaultValue="Production / Role"
                            />
                        </Title>

                        <Group gap="xs" mb="xl">
                            <EditableText
                                contentKey={`${projectKeyBase}.dateFrom`}
                                styleKey="work.detail.date"
                                defaultValue="Start Date"
                                as={Text}
                                c="dimmed"
                                fw={500}
                            />
                            <EditableText contentKey={`${projectKeyBase}.dateSeparator`} defaultValue="—" />
                            <EditableText
                                contentKey={`${projectKeyBase}.dateTo`}
                                styleKey="work.detail.date"
                                defaultValue="End Date"
                                as={Text}
                                c="dimmed"
                                fw={500}
                            />
                        </Group>

                        <Box mb={50}>
                            <EditableParagraphs
                                contentKey={`${projectKeyBase}.contentBlocks`}
                                defaultValue="Describe the production, your role, and your experience here. This area is fully editable and can contain multiple paragraphs."
                            />
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                    </Grid.Col>
                </Grid>

                <Box mt={50}>
                    <Title order={2} mb="xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        <EditableText
                            contentKey={`${projectKeyBase}.gallery_title`}
                            styleKey="work.detail.gallery_title"
                            defaultValue="Gallery"
                        />
                    </Title>
                    <EditableList
                        contentKey={`${projectKeyBase}.gallery`}
                        defaultItems={[]}
                        title="Project Gallery"
                        appendItems={null}
                        renderItem={() => null}
                    />

                    <Box mt="xl">
                        <MasonryGrid
                            items={galleryItems}
                            onItemClick={(index) => handleImageClick(index)}
                        />
                    </Box>
                </Box>

            </motion.div>

            {galleryItems.length > 0 && (
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
                        src={galleryItems[selectedIndex]?.src}
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
