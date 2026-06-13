import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const query = { is_active: true };
        if (req.query.category_id) {
            query.category_id = req.query.category_id;
        }

        if (req.query.search) {
            const search = req.query.search;
            query.$or = [
                { name_en: { $regex: search, $options: 'i' } },
                { name_ar: { $regex: search, $options: 'i' } },
                { description_en: { $regex: search, $options: 'i' } },
                { description_ar: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category')
            .sort({ order: 1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: products,
            current_page: page,
            per_page: limit,
            total,
            last_page: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const adminIndex = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.category_id) {
            query.category_id = req.query.category_id;
        }

        if (req.query.search) {
            const search = req.query.search;
            query.$or = [
                { name_en: { $regex: search, $options: 'i' } },
                { name_ar: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: products,
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
        const product = await Product.findOne({ _id: req.params.id, is_active: true }).populate('category');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const store = async (req, res) => {
    try {
        console.log('Product store - req.body:', req.body);
        const product = await Product.create(req.body);
        await product.populate('category');
        console.log('Product store - created:', product);
        res.status(201).json(product);
    } catch (error) {
        console.error('Product store error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(422).json({
                errors: {
                    [field]: `${field} already exists`
                }
            });
        }
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        console.log('Product update - req.body:', req.body);
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('category');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log('Product update - updated:', product);
        res.json(product);
    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const destroy = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
