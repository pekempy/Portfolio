import fs from 'fs';
import path from 'path';
import { UPLOADS_DIR } from '../utils/paths.js';

import sharp from 'sharp';

export const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path: tempPath, filename } = req.file;
    const nameWithoutExt = path.parse(filename).name;
    const webpFilename = `${nameWithoutExt}.webp`;
    const outputPath = path.join(UPLOADS_DIR, webpFilename);

    try {
        await sharp(tempPath)
            .resize({
                width: 2000,
                height: 2000,
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Remove original file if it's not the same as output
        if (tempPath !== outputPath) {
            fs.unlinkSync(tempPath);
        }

        const url = `/uploads/${webpFilename}`;
        res.json({ url });
    } catch (err) {
        console.error('Image processing failed:', err);
        // Fallback to original file if processing fails
        const url = `/uploads/${filename}`;
        res.json({ url });
    }
};

export const deleteFile = (req, res) => {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};
