import multer from "multer";
import fs, { mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs';

export const mediaThumbnailUpload = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            const uploadDir = 'dist/bucket/images/thumbnails/';

            try {
                if (!existsSync(uploadDir)) {
                    await mkdir(uploadDir, { recursive: true });
                }
                cb(null, uploadDir);
            } catch (error) {
                cb(error as Error, uploadDir);
            }
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, name + '-' + uniqueSuffix + ext);
        }
    })
});

export const deleteThumbnail = async (path: string) => await fs.unlink(path)
