import { Container, Title, Group, Box, Grid, Stack, Text, Divider } from '@mantine/core';
import { EditableText } from '../components/EditableText';
import { EditableResume } from '../components/EditableResume';
import { EditableImage } from '../components/EditableImage';
import { EditableStats } from '../components/EditableStats';
import { EditableResumeSections } from '../components/EditableResumeSections';


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
                                        <EditableText contentKey="resume.title" defaultValue="Aaron Byrnes Resume" />
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

                            <EditableStats
                                contentKey="resume.stats"
                                defaultStats={[
                                    { _id: '1', title: 'Height', subtitle: "6'0\"" },
                                    { _id: '2', title: 'Eyes', subtitle: 'Blue' },
                                    { _id: '3', title: 'Hair', subtitle: 'Brown' },
                                    { _id: '4', title: 'Voice', subtitle: 'Baritone' },
                                ]}
                            />


                            <Divider color="dark.4" />

                            <EditableResumeSections
                                contentKey="resume.combined_content"
                                defaultItems={[
                                    {
                                        _id: '1',
                                        title: 'Summary',
                                        text: 'A passionate and dedicated performer with experience in stage, screen, and voice work. Trained at the Royal Academy of Dramatic Art.',
                                        titleStyle: {
                                            fontFamily: 'Playfair Display, serif',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            marginBottom: '16px',
                                            display: 'block'
                                        },
                                        style: {
                                            lineHeight: 1.8,
                                            color: 'var(--mantine-color-dimmed)',
                                            marginBottom: '32px',
                                            display: 'block'
                                        }
                                    },
                                    {
                                        _id: '2',
                                        title: 'Selected Credits',
                                        text: '• Les Misérables - Jean Valjean - West End\n• Phantom of the Opera - Raoul - UK Tour\n• Macbeth - Macbeth - The Globe',
                                        titleStyle: {
                                            fontFamily: 'Playfair Display, serif',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            marginBottom: '16px',
                                            display: 'block'
                                        },
                                        style: {
                                            lineHeight: 1.8,
                                            color: 'var(--mantine-color-dimmed)',
                                            whiteSpace: 'pre-wrap',
                                            display: 'block'
                                        }
                                    }
                                ]}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </motion.div>
        </Container>
    );
}
