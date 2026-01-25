import app from './server/app.js';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3001;

export default app;

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
