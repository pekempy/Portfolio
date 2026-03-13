import { Navbar } from '../Navbar';
import { Outlet } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { LoadingOverlay, Box } from '@mantine/core';

export function Layout() {
    const { isLoading } = useContent();

    if (isLoading) {
        return (
            <Box h="100vh" w="100vw">
                <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} loaderProps={{ color: 'gold', size: 'xl' }} />
            </Box>
        );
    }

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '60px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>
        </>
    );
}
