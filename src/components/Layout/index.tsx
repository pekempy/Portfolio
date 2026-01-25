import { Navbar } from '../Navbar';
import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '60px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>
        </>
    );
}
