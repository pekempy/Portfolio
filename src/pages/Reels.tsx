import { Container, Title, AspectRatio, Stack, Box, SimpleGrid, Card, Text, Overlay, Group, Center, Image } from '@mantine/core';
import { motion } from 'framer-motion';
import { EditableText } from '../components/EditableText';
import { EditableList, type ListItem } from '../components/EditableList';
import { useContent } from '../context/ContentContext';
import { useState } from 'react';
import { IconPlayerPlayFilled } from '@tabler/icons-react';

const defaultVideos = [
    { _id: '1', title: 'Theatrical Showreel', src: 'https://www.youtube.com/embed/YE7VzlLtp-4' },
    { _id: '2', title: 'Comedic Scene', src: 'https://www.youtube.com/embed/Aq5tM02_bE4' },
    { _id: '3', title: 'Commercial Reel', src: 'https://www.youtube.com/embed/YE7VzlLtp-4' }
];

function getThumbnail(url: string) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let id = '';
        if (url.includes('embed/')) id = url.split('embed/')[1]?.split('?')[0];
        else if (url.includes('v=')) id = url.split('v=')[1]?.split('&')[0];
        else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1]?.split('?')[0];

        if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    if (url.includes('vimeo.com')) {
        const id = url.split('/').pop()?.split('?')[0];
        return `https://vumbnail.com/${id}.jpg`;
    }
    return '/hero.png';
}

function getEmbedUrl(url: string) {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let id = '';
        if (url.includes('embed/')) id = url.split('embed/')[1]?.split('?')[0];
        else if (url.includes('v=')) id = url.split('v=')[1]?.split('&')[0];
        else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1]?.split('?')[0];

        return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
        const id = url.split('/').pop()?.split('?')[0];
        return id ? `https://player.vimeo.com/video/${id}` : url;
    }
    return url;
}

export function Reels() {
    const { content } = useContent();
    const reels = (content['reels.items'] as ListItem[]) || defaultVideos;
    const [activeVideoIndex, setActiveActiveVideoIndex] = useState(0);

    const activeVideo = reels[activeVideoIndex] || reels[0];

    return (
        <Container size="xl" py={80} mt="xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Title order={1} ta="center" mb={60} style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    letterSpacing: '1px'
                }}>
                    <EditableText contentKey="reels.title" defaultValue="SHOWREELS" />
                </Title>
            </motion.div>

            {reels.length > 0 && (
                <Stack gap={100}>
                    {/* Featured Video Section */}
                    <motion.div
                        key={activeVideo?._id || activeVideoIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Stack gap="xl" align="center">
                            <Box w="100%" max-width={1000} pos="relative">
                                {/* Decorative Glow */}
                                <Box
                                    pos="absolute"
                                    top="-5%"
                                    left="5%"
                                    right="5%"
                                    bottom="-5%"
                                    style={{
                                        background: 'radial-gradient(circle, rgba(219, 198, 116, 0.15) 0%, transparent 70%)',
                                        filter: 'blur(40px)',
                                        zIndex: -1
                                    }}
                                />
                                <AspectRatio ratio={16 / 9} style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <iframe
                                        src={getEmbedUrl(String(activeVideo.src))}
                                        title={activeVideo.title}
                                        style={{ border: 0 }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </AspectRatio>
                            </Box>

                            <Box ta="center">
                                <Title order={2} style={{ fontWeight: 300, fontSize: '2rem' }}>
                                    {activeVideo.title}
                                </Title>
                                <Text c="dimmed" mt="xs" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                    Now Playing
                                </Text>
                            </Box>
                        </Stack>
                    </motion.div>

                    {/* All Reels Grid */}
                    <Box mt={40}>
                        <Group justify="space-between" align="flex-end" mb="xl">
                            <Title order={3} style={{ fontFamily: 'Playfair Display, serif' }}>
                                <EditableText contentKey="reels.list_title" defaultValue="ALL REELS" />
                            </Title>
                            <Box h={1} bg="gold" style={{ flex: 1, marginLeft: '20px', opacity: 0.3 }} />
                        </Group>

                        <EditableList
                            contentKey="reels.items"
                            defaultItems={defaultVideos}
                            title="Reels Collection"
                            itemContainer={SimpleGrid}
                            itemContainerProps={{ cols: { base: 1, sm: 2, md: 3 }, spacing: 'xl' }}
                            renderItem={(vid, index) => (
                                <motion.div
                                    key={vid._id || index}
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        shadow="md"
                                        radius="md"
                                        padding={0}
                                        style={{
                                            cursor: 'pointer',
                                            border: activeVideoIndex === index ? '2px solid gold' : '1px solid rgba(255,255,255,0.1)',
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            overflow: 'hidden'
                                        }}
                                        onClick={() => setActiveActiveVideoIndex(index)}
                                    >
                                        <AspectRatio ratio={16 / 9} pos="relative">
                                            <Image
                                                src={getThumbnail(String(vid.src))}
                                                style={{ transition: 'transform 0.5s' }}
                                                className="video-thumbnail"
                                            />
                                            <Overlay color="#000" backgroundOpacity={0.4} />
                                            <Center pos="absolute" inset={0} style={{ zIndex: 1 }}>
                                                <Box
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(219, 198, 116, 0.9)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'black',
                                                        boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    <IconPlayerPlayFilled size={24} />
                                                </Box>
                                            </Center>
                                        </AspectRatio>
                                        <Box p="md">
                                            <Title order={4} size="md" ta="center" style={{ fontWeight: 400 }}>
                                                {vid.title}
                                            </Title>
                                        </Box>
                                    </Card>
                                </motion.div>
                            )}
                        />
                    </Box>
                </Stack>
            )}

            {/* Bottom CTA */}
            <Stack align="center" mt={150} gap="xl">
                <Box h={100} w={1} bg="gold" style={{ opacity: 0.3 }} />
                <Title order={3} ta="center" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <EditableText contentKey="reels.cta_title" defaultValue="INTERESTED IN COLLABORATING?" />
                </Title>
                <EditableText
                    contentKey="reels.cta_button"
                    defaultValue="GET IN TOUCH"
                    as="button"
                    style={{
                        padding: '12px 40px',
                        backgroundColor: 'transparent',
                        border: '1px solid gold',
                        color: 'gold',
                        cursor: 'pointer',
                        letterSpacing: '2px',
                        fontWeight: 600
                    }}
                    onClick={() => window.location.href = '/contact'}
                />
            </Stack>
        </Container>
    );
}

