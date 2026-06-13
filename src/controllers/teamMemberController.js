import TeamMember from '../models/TeamMember.js';

export const index = async (req, res) => {
    try {
        const teamMembers = await TeamMember.find({ is_active: true }).sort({ order: 1 });
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const adminIndex = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const total = await TeamMember.countDocuments();
        const teamMembers = await TeamMember.find().sort({ order: 1 }).skip(skip).limit(limit);

        res.json({
            data: teamMembers,
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
        const teamMember = await TeamMember.findOne({ _id: req.params.id, is_active: true });
        if (!teamMember) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        res.json(teamMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const store = async (req, res) => {
    try {
        const teamMember = await TeamMember.create(req.body);
        res.status(201).json(teamMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!teamMember) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        res.json(teamMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const destroy = async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ error: 'Team member not found' });
        }
        res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
