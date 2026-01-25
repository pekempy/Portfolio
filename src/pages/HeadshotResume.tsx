import { Container, Title, SimpleGrid, Group, Box, Grid, Stack, Text, Divider } from '@mantine/core';
import { EditableText } from '../components/EditableText';
import { EditableResume } from '../components/EditableResume';
import { EditableImage } from '../components/EditableImage';


import { motion } from 'framer-motion';

export function HeadshotResume() {


    return (
        <Container size="xl" py="xl" mt="xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <Grid gutter={60} mb={100}>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Box style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            <EditableImage
                                contentKey="headshot.main"
                                defaultValue="/about.png"
                                h={600}
                                w="100%"
                                fit="cover"
                            />
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Stack gap="xl">
                            <Group justify="space-between" align="flex-start">
                                <Box>
                                    <Title order={1} mb="xs" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        <EditableText contentKey="resume.title" defaultValue="Resume" />
                                    </Title>
                                    <EditableText
                                        contentKey="resume.subtitle"
                                        defaultValue="Professional Actor & Performer"
                                        as={Text}
                                        c="dimmed"
                                        size="lg"
                                    />
                                </Box>
                                <EditableResume />
                            </Group>

                            <Divider color="dark.4" />

                            <SimpleGrid cols={2} spacing="xl">
                                <Box>
                                    <EditableText
                                        contentKey="resume.label.height"
                                        defaultValue="Height"
                                        as={Text}
                                        size="sm"
                                        c="dimmed"
                                        tt="uppercase"
                                        mb={5}
                                        fw={700}
                                        style={{ letterSpacing: '1px' }}
                                    />
                                    <EditableText contentKey="resume.stat.height" defaultValue="6'0&quot;" fw={500} />
                                </Box>
                                <Box>
                                    <EditableText
                                        contentKey="resume.label.eyes"
                                        defaultValue="Eyes"
                                        as={Text}
                                        size="sm"
                                        c="dimmed"
                                        tt="uppercase"
                                        mb={5}
                                        fw={700}
                                        style={{ letterSpacing: '1px' }}
                                    />
                                    <EditableText contentKey="resume.stat.eyes" defaultValue="Blue" fw={500} />
                                </Box>
                                <Box>
                                    <EditableText
                                        contentKey="resume.label.hair"
                                        defaultValue="Hair"
                                        as={Text}
                                        size="sm"
                                        c="dimmed"
                                        tt="uppercase"
                                        mb={5}
                                        fw={700}
                                        style={{ letterSpacing: '1px' }}
                                    />
                                    <EditableText contentKey="resume.stat.hair" defaultValue="Brown" fw={500} />
                                </Box>
                                <Box>
                                    <EditableText
                                        contentKey="resume.label.voice"
                                        defaultValue="Voice"
                                        as={Text}
                                        size="sm"
                                        c="dimmed"
                                        tt="uppercase"
                                        mb={5}
                                        fw={700}
                                        style={{ letterSpacing: '1px' }}
                                    />
                                    <EditableText contentKey="resume.stat.voice" defaultValue="Baritone" fw={500} />
                                </Box>
                            </SimpleGrid>

                            <Divider color="dark.4" />

                            <Box>
                                <Title order={3} mb="md" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    <EditableText contentKey="resume.section1.title" defaultValue="Summary" />
                                </Title>
                                <EditableText
                                    contentKey="resume.section1.content"
                                    defaultValue="A passionate and dedicated performer with experience in stage, screen, and voice work. Trained at the Royal Academy of Dramatic Art."
                                    multiline
                                    style={{ lineHeight: 1.8, color: 'var(--mantine-color-dimmed)' }}
                                />
                            </Box>

                            <Box>
                                <Title order={3} mb="md" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    <EditableText contentKey="resume.section2.title" defaultValue="Selected Credits" />
                                </Title>
                                <EditableText
                                    contentKey="resume.section2.content"
                                    defaultValue="• Les Misérables - Jean Valjean - West End&#10;• Phantom of the Opera - Raoul - UK Tour&#10;• Macbeth - Macbeth - The Globe"
                                    multiline
                                    style={{ lineHeight: 1.8, color: 'var(--mantine-color-dimmed)', whiteSpace: 'pre-wrap' }}
                                />
                            </Box>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </motion.div>
        </Container>
    );
}
