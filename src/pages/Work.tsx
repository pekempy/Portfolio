import { Container, Title, SimpleGrid, Card, Image, Text, Box, AspectRatio, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EditableText } from '../components/EditableText';
import { EditableList } from '../components/EditableList';

const defaultWork = [
    { _id: '1', title: 'Fiddler on the Roof', src: '/hero.png', slug: 'fiddler-on-the-roof', subtitle: 'Tevye', dateFrom: 'Jan 2024', dateTo: 'Feb 2024' },
    { _id: '2', title: 'Les Misérables', src: '/about.png', slug: 'les-miserables', subtitle: 'Jean Valjean', dateFrom: 'Sep 2023', dateTo: 'Oct 2023' },
];

export function Work() {

    return (
        <Container size="xl" py="xl" mt="xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Title order={1} mb={50} ta="center" style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem' }}>
                    <EditableText contentKey="work.title" defaultValue="My Work" />
                </Title>

                <EditableList
                    contentKey="work.items"
                    defaultItems={defaultWork}
                    title="Work Projects"
                    itemContainer={SimpleGrid}
                    itemContainerProps={{ cols: { base: 1, sm: 2, md: 3 }, spacing: 'xl' }}
                    enableSubtitle
                    enableDate
                    renderItem={(item, index) => {
                        const slug = item.slug || (item.title ? item.title.toLowerCase().replace(/ /g, '-') : `project-${index}`);

                        return (
                            <Link to={`/work/${slug}`} key={item._id || index} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card shadow="sm" radius="md" padding="0" style={{ overflow: 'hidden', border: 'none', backgroundColor: 'transparent' }}>
                                        <AspectRatio ratio={3 / 4}>
                                            <Image
                                                src={item.src}
                                                h="100%"
                                                style={{ transition: 'transform 0.5s', objectFit: 'cover' }}
                                                className="work-thumbnail"
                                            />
                                        </AspectRatio>
                                        <Box py="md" px="xs">
                                            <Title order={3} style={{ fontFamily: 'Playfair Display, serif' }} c="white">
                                                {item.title}
                                            </Title>
                                            <Group justify="space-between" align="center" mt={5}>
                                                <Text c="dimmed" size="sm">
                                                    {item.subtitle || 'Production / Role'}
                                                </Text>
                                                {(item.dateFrom || item.dateTo) && (
                                                    <Text c="dimmed" size="xs">
                                                        {item.dateFrom}{item.dateTo ? ` — ${item.dateTo}` : ''}
                                                    </Text>
                                                )}
                                            </Group>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Link>
                        );
                    }}
                />
            </motion.div>
        </Container>
    );
}
