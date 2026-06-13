import Catalog from '../models/Catalog.js';

export const index = async (req, res) => {
    try {
        const catalogs = await Catalog.find({ is_active: true }).sort({ order: 1 });
        res.json(catalogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const adminIndex = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const total = await Catalog.countDocuments();
        const catalogs = await Catalog.find().sort({ order: 1 }).skip(skip).limit(limit);

        res.json({
            data: catalogs,
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
        const catalog = await Catalog.findOne({ _id: req.params.id, is_active: true });
        if (!catalog) {
            return res.status(404).json({ error: 'Catalog not found' });
        }
        res.json(catalog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const store = async (req, res) => {
    try {
        const catalog = await Catalog.create(req.body);
        res.status(201).json(catalog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const catalog = await Catalog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!catalog) {
            return res.status(404).json({ error: 'Catalog not found' });
        }
        res.json(catalog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const destroy = async (req, res) => {
    try {
        const catalog = await Catalog.findByIdAndDelete(req.params.id);
        if (!catalog) {
            return res.status(404).json({ error: 'Catalog not found' });
        }
        res.json({ message: 'Catalog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
