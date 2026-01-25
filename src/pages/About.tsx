import { Container, Grid, Title, Text, Box, Stack, Paper } from '@mantine/core';
import { motion } from 'framer-motion';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';

export function About() {
    return (
        <Container size="xl" py="xl" mt="xl">
            <Grid gutter={50} align="center">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Box pos="relative">
                            <Box
                                pos="absolute"
                                top={20}
                                left={20}
                                w="100%"
                                h="100%"
                                bg="rgba(255,255,255,0.05)"
                                style={{ zIndex: 0 }}
                            />
                            <Paper radius="sm" shadow="xl">
                                <EditableImage
                                    contentKey="about.image"
                                    defaultValue="/about.png"
                                    radius="sm"
                                    style={{ zIndex: 1, position: 'relative' }}
                                />
                            </Paper>
                        </Box>
                    </motion.div>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="lg">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Title order={1} mb="md" style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem' }}>
                                <EditableText contentKey="about.title" defaultValue="About Me" />
                            </Title>
                            <EditableText
                                contentKey="about.bio1"
                                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere nec iaculis imperdiet nascetur vivamus himenaeos integer curabitur tincidunt mollis. Felis consectetur feugiat sagittis sed fusce metus quam phasellus sapien justo."
                                as={Text}
                                size="lg"
                                c="dimmed"
                                mb="md"
                            />
                            <EditableText
                                contentKey="about.bio2"
                                defaultValue='Aliquet pellentesque odio fringilla nulla sociosqu dignissim mollis eleifend. Potenti suscipit purus fermentum egestas pretium cubilia taciti nostra. Natoque orci cum mauris dapibus natoque fermentum sem egestas. Erat a ligula dictum porta sagittis imperdiet viverra nam.'
                                as={Text}
                                size="lg"
                                c="dimmed"
                                mb="md"
                            />
                            <EditableText
                                contentKey="about.bio3"
                                defaultValue="Interdum tincidunt neque montes vitae consectetur vulputate magna aliquam malesuada. Auctor elementum quam blandit dictumst quisque blandit tortor vitae egestas."
                                as={Text}
                                size="lg"
                                c="dimmed"
                            />
                        </motion.div>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
