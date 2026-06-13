import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

import os from 'os';

// Increase file size limit to 50MB
// Use /tmp on serverless environments because the root file system is read-only
const uploadDir = process.env.VERCEL || process.env.NODE_ENV === 'production' ? os.tmpdir() : 'uploads/';

const upload = multer({
    dest: uploadDir,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB in bytes
    }
});

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(422).json({ error: 'File is required' });
        }

        const type = req.body.type || 'image';
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: type === 'image' ? 'herbs/images' : 'herbs/documents',
            // Allow large files on Cloudinary (Cloudinary's default limits are already high, but just in case)
            chunk_size: 6000000 // 6MB chunks for large file uploads
        });

        res.json({
            path: result.public_id,
            url: result.secure_url,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
};

export { upload };
