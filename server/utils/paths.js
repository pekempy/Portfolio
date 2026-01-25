import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

export const UPLOADS_DIR = path.join(rootDir, 'public', 'uploads');
export const DATA_DIR = path.join(rootDir, 'data');
export const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
export const STAGED_FILE = path.join(DATA_DIR, 'content.staged.json');
export const VERSIONS_DIR = path.join(DATA_DIR, 'versions');
export const DIST_DIR = path.join(rootDir, 'dist');
