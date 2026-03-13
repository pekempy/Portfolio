import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const UPLOADS_DIR = path.join(rootDir, 'public', 'uploads');
const DATA_DIR = path.join(rootDir, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const STAGED_FILE = path.join(DATA_DIR, 'content.staged.json');

async function optimizeImages() {
    if (!fs.existsSync(UPLOADS_DIR)) {
        console.log('Uploads directory not found at:', UPLOADS_DIR);
        return;
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    const mapping = {};

    console.log(`Found ${files.length} files in uploads.`);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const nameWithoutExt = path.parse(file).name;
            const webpName = `${nameWithoutExt}.webp`;
            const inputPath = path.join(UPLOADS_DIR, file);
            const outputPath = path.join(UPLOADS_DIR, webpName);

            // Skip if webp already exists
            if (fs.existsSync(outputPath) && file !== webpName) {
                mapping[`/uploads/${file}`] = `/uploads/${webpName}`;
                continue;
            }

            try {
                console.log(`Optimizing ${file}...`);
                await sharp(inputPath)
                    .resize({
                        width: 2000,
                        height: 2000,
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                
                mapping[`/uploads/${file}`] = `/uploads/${webpName}`;
            } catch (err) {
                console.error(`Failed to optimize ${file}:`, err);
            }
        }
    }

    // Update JSON files to point to new WebP files
    [CONTENT_FILE, STAGED_FILE].forEach(filePath => {
        if (fs.existsSync(filePath)) {
            console.log(`Updating references in ${path.basename(filePath)}...`);
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;

            for (const [oldUrl, newUrl] of Object.entries(mapping)) {
                if (content.includes(oldUrl)) {
                    const regex = new RegExp(oldUrl.replace(/\//g, '\\/'), 'g');
                    content = content.replace(regex, newUrl);
                    updated = true;
                }
            }

            if (updated) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${path.basename(filePath)}.`);
            } else {
                console.log(`No updates needed for ${path.basename(filePath)}.`);
            }
        }
    });

    console.log('✅ Optimization complete!');
    console.log('You can now safely delete the old .jpg and .png files from public/uploads if you wish.');
}

optimizeImages().catch(console.error);
