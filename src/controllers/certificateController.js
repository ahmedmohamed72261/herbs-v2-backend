import Certificate from '../models/Certificate.js';

export const index = async (req, res) => {
    try {
        const certificates = await Certificate.find({ is_active: true }).sort({ order: 1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const adminIndex = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Certificate.countDocuments();
        const certificates = await Certificate.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.json({
            data: certificates,
            current_page: page,
            per_page: limit,
            total,
            last_page: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const show = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ _id: req.params.id, is_active: true });
        if (!certificate) {
            return res.status(404).json({ error: 'Certificate not found' });
        }
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const store = async (req, res) => {
    try {
        const certificate = await Certificate.create(req.body);
        res.status(201).json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!certificate) {
            return res.status(404).json({ error: 'Certificate not found' });
        }
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const destroy = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);
        if (!certificate) {
            return res.status(404).json({ error: 'Certificate not found' });
        }
        res.json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
