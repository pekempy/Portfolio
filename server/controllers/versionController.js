import fs from 'fs';
import path from 'path';
import { VERSIONS_DIR, STAGED_FILE } from '../utils/paths.js';

export const getVersions = (req, res) => {
    if (!fs.existsSync(VERSIONS_DIR)) return res.json([]);
    const files = fs.readdirSync(VERSIONS_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => {
            const stats = fs.statSync(path.join(VERSIONS_DIR, f));
            return {
                id: f,
                name: f.replace('content_', '').replace('.json', '').replace(/-/g, ':'),
                timestamp: stats.mtime
            };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    res.json(files);
};

export const revertVersion = (req, res) => {
    const { versionId } = req.body;
    const versionPath = path.join(VERSIONS_DIR, versionId);

    if (fs.existsSync(versionPath)) {
        fs.copyFileSync(versionPath, STAGED_FILE);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Version not found' });
    }
};
