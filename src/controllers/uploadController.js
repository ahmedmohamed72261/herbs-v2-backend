import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

// Increase file size limit to 50MB
const upload = multer({
    dest: 'uploads/',
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
