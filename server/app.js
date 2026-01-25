import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { UPLOADS_DIR, DIST_DIR, STAGED_FILE, CONTENT_FILE } from './utils/paths.js';
import { initDirectories } from './services/fileService.js';
import apiRouter from './routes/api.js';
import { apiLimiter } from './middleware/limiters.js';
import fs from 'fs';

// Initialize directories
initDirectories();

// Initialize staged file if missing
if (!fs.existsSync(STAGED_FILE)) {
    if (fs.existsSync(CONTENT_FILE)) {
        fs.copyFileSync(CONTENT_FILE, STAGED_FILE);
    } else {
        fs.writeFileSync(STAGED_FILE, JSON.stringify({}, null, 2));
    }
}

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Static files
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(DIST_DIR));

// API Router
app.use('/api', apiLimiter, apiRouter);

// SPA fallback
app.get(/^(?!\/api).+/, (req, res) => {
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Not Found');
    }
});

export default app;
