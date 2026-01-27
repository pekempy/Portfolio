import { Container, Title, SimpleGrid, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { EditableText } from '../components/EditableText';
import { EditableSocialLinks } from '../components/EditableSocialLinks';
import { EditableParagraphs } from '../components/EditableParagraphs';

const defaultSocials = [
    { _id: 'social-1', icon: 'instagram', url: '#', style: { color: '#ffffff', hoverColor: '#dbc674' } },
    { _id: 'social-2', icon: 'twitter', url: '#', style: { color: '#ffffff', hoverColor: '#dbc674' } },
    { _id: 'social-3', icon: 'linkedin', url: '#', style: { color: '#ffffff', hoverColor: '#dbc674' } },
    { _id: 'social-4', icon: 'email', url: 'mailto:john@example.com', style: { color: '#ffffff', hoverColor: '#dbc674' } },
];

export function Contact() {

    return (
        <Container size="xl" py="xl" mt="xl">
            <SimpleGrid cols={{ base: 1, md: 1 }} spacing={50}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Title order={1} mb="xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        <EditableText contentKey="contact.title" defaultValue="Get in Touch" />

                    </Title>
                    <Box mb="xl">
                        <EditableParagraphs
                            contentKey="contact.combined_content"
                            defaultItems={[
                                {
                                    _id: '1',
                                    title: 'Description',
                                    text: 'For booking inquiries, collaborations, or just to say hello, please drop me an email.',
                                    style: {
                                        fontSize: '18px', // size="lg"
                                        color: 'var(--mantine-color-dimmed)',
                                        marginBottom: '32px'
                                    }
                                },
                                {
                                    _id: '2',
                                    title: 'Rep 1 Header',
                                    text: 'Representation',
                                    style: {
                                        fontFamily: 'Playfair Display, serif',
                                        fontSize: '20px', // h3 approx
                                        fontWeight: 'bold',
                                        marginBottom: '16px'
                                    }
                                },
                                {
                                    _id: '3',
                                    title: 'Rep 1 Content',
                                    text: 'Creative Artists Agency (CAA)\nagent@caa.com | +1 (555) 123-4567',
                                    style: {
                                        fontWeight: 600,
                                        marginBottom: '5px',
                                        whiteSpace: 'pre-line'
                                    }
                                },
                                {
                                    _id: '4',
                                    title: 'Rep 2 Header',
                                    text: 'Direct Management',
                                    style: {
                                        fontFamily: 'Playfair Display, serif',
                                        fontSize: '20px', // h3 approx
                                        fontWeight: 'bold',
                                        marginBottom: '16px',
                                        marginTop: '16px'
                                    }
                                },
                                {
                                    _id: '5',
                                    title: 'Rep 2 Content',
                                    text: 'Jane Doe Management\njane@management.com | +1 (555) 987-6543',
                                    style: {
                                        fontWeight: 600,
                                        marginBottom: '5px',
                                        whiteSpace: 'pre-line'
                                    }
                                }
                            ]}
                        />
                    </Box>

                    <EditableSocialLinks
                        contentKey="contact.social.list"
                        defaultItems={defaultSocials}
                    />
                </motion.div>

                {/* 
                    Un-comment for a contact form
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <form onSubmit={form.onSubmit((values) => console.log(values))}>
                        <TextInput
                            label="Name"
                            placeholder="Your name"
                            size="md"
                            mb="md"
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Email"
                            placeholder="your@email.com"
                            size="md"
                            mb="md"
                            {...form.getInputProps('email')}
                        />
                        <TextInput
                            label="Subject"
                            placeholder="Subject"
                            size="md"
                            mb="md"
                            {...form.getInputProps('subject')}
                        />
                        <Textarea
                            label="Message"
                            placeholder="Your message"
                            minRows={5}
                            size="md"
                            mb="xl"
                            {...form.getInputProps('message')}
                        />
                        <Button type="submit" size="lg" color="gold" fullWidth c="dark">
                            Send Message
                        </Button>
                    </form>
                </motion.div> */}
            </SimpleGrid>
        </Container >
    );
}
