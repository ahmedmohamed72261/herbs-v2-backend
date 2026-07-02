import ExportCountry from '../models/ExportCountry.js';

export const index = async (req, res) => {
    try {
        const countries = await ExportCountry.find({ is_active: true }).sort({ display_order: 1 });
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const adminIndex = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await ExportCountry.countDocuments();
        const countries = await ExportCountry.find().sort({ display_order: 1 }).skip(skip).limit(limit);

        res.json({
            data: countries,
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
        const country = await ExportCountry.findOne({ _id: req.params.id, is_active: true });
        if (!country) {
            return res.status(404).json({ error: 'Export country not found' });
        }
        res.json(country);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const store = async (req, res) => {
    try {
        const country = await ExportCountry.create(req.body);
        res.status(201).json(country);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const country = await ExportCountry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!country) {
            return res.status(404).json({ error: 'Export country not found' });
        }
        res.json(country);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const destroy = async (req, res) => {
    try {
        const country = await ExportCountry.findByIdAndDelete(req.params.id);
        if (!country) {
            return res.status(404).json({ error: 'Export country not found' });
        }
        res.json({ message: 'Export country deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};