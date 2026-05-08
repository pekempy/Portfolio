import app from './server/app.js';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3001;

const HOST = '0.0.0.0';

export default app;

const server = app.listen(PORT, HOST, () => {
    console.log(`Backend server running at http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
