import { Container, TextInput, PasswordInput, Button, Paper, Title, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useContent } from '../context/ContentContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Login() {
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        return () => {
            document.head.removeChild(meta);
        };
    }, []);
    const { login, logout, isAdmin } = useContent();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        const success = await login(values);
        if (success) {
            navigate('/');
        }
    };

    if (isAdmin) {
        return (
            <Container size="xs" mt={100}>
                <Paper p="xl" withBorder>
                    <Title order={2} ta="center" mb="lg">Welcome Back</Title>
                    <Button fullWidth onClick={async () => { await logout(); navigate('/login-page'); }} color="red" variant="light">Logout</Button>
                </Paper>
            </Container>
        )
    }

    return (
        <Container size="xs" mt={100}>
            <Paper p="xl" withBorder shadow="xl">
                <Title order={2} ta="center" mb="lg" style={{ fontFamily: 'Playfair Display' }}>Login</Title>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput label="Username" {...form.getInputProps('username')} />
                        <PasswordInput label="Password" {...form.getInputProps('password')} />
                        <Button type="submit" color="gold" c="dark">Login</Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
