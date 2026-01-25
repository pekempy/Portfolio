import { Container, Title, SimpleGrid, Text, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { EditableText } from '../components/EditableText';
import { EditableSocialLinks } from '../components/EditableSocialLinks';

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
                    <EditableText
                        contentKey="contact.description"
                        defaultValue="For booking inquiries, collaborations, or just to say hello, please drop me an email."
                        as={Text}
                        size="lg"
                        c="dimmed"
                        mb="xl"
                    />

                    <Box mb="xl">
                        <Title order={3} mb="md"><EditableText contentKey="contact.rep1.title" defaultValue="Representation" /></Title>
                        <EditableText contentKey="contact.rep1.name" defaultValue="Creative Artists Agency (CAA)" as={Text} fw={600} mb={5} />
                        <EditableText contentKey="contact.rep1.details" defaultValue="agent@caa.com | +1 (555) 123-4567" as={Text} c="dimmed" mb={20} />

                        <Title order={3} mb="md"><EditableText contentKey="contact.rep2.title" defaultValue="Direct Management" /></Title>
                        <EditableText contentKey="contact.rep2.name" defaultValue="Jane Doe Management" as={Text} fw={600} mb={5} />
                        <EditableText contentKey="contact.rep2.details" defaultValue="jane@management.com | +1 (555) 987-6543" as={Text} c="dimmed" />
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
        </Container>
    );
}
