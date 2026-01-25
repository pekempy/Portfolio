import fs from 'fs';
import path from 'path';
import { CONTENT_FILE, STAGED_FILE, VERSIONS_DIR, UPLOADS_DIR } from '../utils/paths.js';
import { extractUploads } from '../services/fileService.js';

export const getContent = (req, res) => {
    if (fs.existsSync(CONTENT_FILE)) {
        const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } else {
        res.json({});
    }
};

export const getStagedContent = (req, res) => {
    if (fs.existsSync(STAGED_FILE)) {
        const data = fs.readFileSync(STAGED_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } else {
        res.json({});
    }
};

export const updateContent = (req, res) => {
    const content = req.body;
    const isStaged = req.query.staged === 'true';
    const targetFile = isStaged ? STAGED_FILE : CONTENT_FILE;

    fs.writeFileSync(targetFile, JSON.stringify(content, null, 2));
    res.json({ success: true });
};

export const publish = (req, res) => {
    if (!fs.existsSync(STAGED_FILE)) {
        return res.status(404).json({ error: 'Staged content not found' });
    }

    if (fs.existsSync(CONTENT_FILE)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const snapshotPath = path.join(VERSIONS_DIR, `content_${timestamp}.json`);
        fs.copyFileSync(CONTENT_FILE, snapshotPath);
    }

    const data = fs.readFileSync(STAGED_FILE, 'utf-8');
    fs.writeFileSync(CONTENT_FILE, data);
    res.json({ success: true });
};

export const discard = (req, res) => {
    try {
        const inUse = new Set();
        if (fs.existsSync(CONTENT_FILE)) {
            extractUploads(JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8')), inUse);
        }
        if (fs.existsSync(VERSIONS_DIR)) {
            fs.readdirSync(VERSIONS_DIR).forEach(file => {
                if (file.endsWith('.json')) {
                    const vPath = path.join(VERSIONS_DIR, file);
                    extractUploads(JSON.parse(fs.readFileSync(vPath, 'utf-8')), inUse);
                }
            });
        }

        if (fs.existsSync(STAGED_FILE)) {
            const stagedUrls = extractUploads(JSON.parse(fs.readFileSync(STAGED_FILE, 'utf-8')));
            stagedUrls.forEach(url => {
                if (!inUse.has(url)) {
                    const filename = url.replace('/uploads/', '');
                    const filePath = path.join(UPLOADS_DIR, filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`Cleaned up orphaned image: ${filename}`);
                    }
                }
            });
        }

        if (fs.existsSync(CONTENT_FILE)) {
            fs.copyFileSync(CONTENT_FILE, STAGED_FILE);
        } else {
            fs.writeFileSync(STAGED_FILE, JSON.stringify({}, null, 2));
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Discard/Cleanup error:', err);
        res.status(500).json({ error: 'Failed to discard changes' });
    }
};
