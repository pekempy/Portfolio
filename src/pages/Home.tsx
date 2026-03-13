import { Container, Title, Text, Button, Group, Overlay, Stack, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import { useContent } from '../context/ContentContext';
import { IconPhoto } from '@tabler/icons-react';

export function Home() {
    const navigate = useNavigate();
    const { isEditable } = useContent();

    return (
        <Box h="100vh" w="100%" pos="relative" style={{ overflow: 'hidden' }}>
            {isEditable && (
                <Box pos="absolute" top={100} right={40} style={{ zIndex: 1000 }}>
                    <EditableImage
                        contentKey="home.hero"
                        defaultValue="/hero.png"
                        customTrigger={
                            <Button
                                leftSection={<IconPhoto size={16} />}
                                variant="filled"
                                color="gold"
                                c="dark"
                                size="md"
                            >
                                Edit Hero Image
                            </Button>
                        }
                    />
                </Box>
            )}

            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: 'easeOut' }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                }}
            >
                <EditableImage
                    contentKey="home.hero"
                    defaultValue="/hero.png"
                    h="100%"
                    w="100%"
                    fit="cover"
                    loading="eager"
                    style={{ display: 'block' }}
                />
            </motion.div>

            <Overlay
                gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.65) 40%, rgba(0, 0, 0, 0.95) 100%)"
                opacity={1}
                zIndex={1}
                style={{ pointerEvents: isEditable ? 'none' : 'auto' }}
            />

            <Container size="xl" h="100%" pos="relative" style={{ zIndex: 2 }}>
                <Stack h="100%" justify="center" gap="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Title
                            order={1}
                            style={{
                                fontSize: 'clamp(3rem, 5vw, 6rem)',
                                color: 'var(--mantine-color-white)',
                                lineHeight: 1.1,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '1rem'
                            }}
                        >
                            <EditableText contentKey="home.title" defaultValue="AARON BYRNES" />
                        </Title>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <EditableText
                            contentKey="home.subtitle"
                            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                            as={Text}
                            size="xl"
                            c="dimmed"
                            style={{ maxWidth: 600, fontSize: '1.5rem', fontWeight: 300 }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <Group mt="xl">
                            <EditableText
                                contentKey="home.cta.reels"
                                defaultValue="Watch Reels"
                                as={Button}
                                size="xl"
                                variant="filled"
                                color="gold"
                                c="dark.9"
                                onClick={() => navigate('/reels')}
                                styles={{ root: { transition: 'transform 0.2s' }, label: { fontWeight: 600 } }}
                            />
                            <EditableText
                                contentKey="home.cta.contact"
                                defaultValue="Get in Touch"
                                as={Button}
                                size="xl"
                                variant="outline"
                                color="white"
                                onClick={() => navigate('/contact')}
                            />
                        </Group>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    );
}
