import fs from 'fs';
import path from 'path';
import { UPLOADS_DIR, DATA_DIR, VERSIONS_DIR } from '../utils/paths.js';

export const initDirectories = () => {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(VERSIONS_DIR)) fs.mkdirSync(VERSIONS_DIR, { recursive: true });
};

export const extractUploads = (obj, set = new Set()) => {
    if (!obj) return set;
    if (typeof obj === 'string') {
        if (obj.startsWith('/uploads/')) set.add(obj);
    } else if (Array.isArray(obj)) {
        obj.forEach(i => extractUploads(i, set));
    } else if (typeof obj === 'object') {
        Object.values(obj).forEach(i => extractUploads(i, set));
    }
    return set;
};
