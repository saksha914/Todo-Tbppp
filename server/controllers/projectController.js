import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            color,
            icon,
            members,
            labels,
            settings
        } = req.body;

        const project = new Project({
            name,
            description,
            color,
            icon,
            members: [
                {
                    user: req.user.id,
                    role: 'owner'
                },
                ...(members || [])
            ],
            labels,
            settings,
            createdBy: req.user.id
        });

        await project.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const query = {
            $or: [
                { createdBy: req.user.id },
                { 'members.user': req.user.id }
            ]
        };

        if (search) {
            query.$or.push(
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            );
        }

        const projects = await Project.find(query)
            .populate('createdBy', 'username profile')
            .populate('members.user', 'username profile')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Project.countDocuments(query);

        res.json({
            projects,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'username profile')
            .populate('members.user', 'username profile')
            .populate('tasks', 'title status dueDate priority');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has access to the project
        const hasAccess = project.members.some(
            member => member.user._id.toString() === req.user.id
        );

        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const {
            name,
            description,
            color,
            icon,
            members,
            labels,
            settings
        } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has permission to update
        const userRole = project.members.find(
            member => member.user.toString() === req.user.id
        )?.role;

        if (!userRole || (userRole !== 'owner' && userRole !== 'admin')) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update project
        project.name = name || project.name;
        project.description = description || project.description;
        project.color = color || project.color;
        project.icon = icon || project.icon;
        project.labels = labels || project.labels;
        project.settings = settings ? { ...project.settings, ...settings } : project.settings;

        // Handle member updates
        if (members) {
            const newMembers = members.filter(
                member => !project.members.some(m => m.user.toString() === member.user)
            );

            project.members = [
                ...project.members.filter(m => m.role === 'owner'),
                ...members
            ];

        }

        await project.save();

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is the owner
        const isOwner = project.members.some(
            member => member.user.toString() === req.user.id && member.role === 'owner'
        );

        if (!isOwner) {
            return res.status(403).json({ message: 'Only the owner can delete the project' });
        }

        // Delete all tasks associated with the project
        await Task.deleteMany({ project: project._id });

        await project.deleteOne();

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};

export const updateProjectMember = async (req, res) => {
    try {
        const { userId, role } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user has permission to update members
        const userRole = project.members.find(
            member => member.user.toString() === req.user.id
        )?.role;

        if (!userRole || (userRole !== 'owner' && userRole !== 'admin')) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update member role
        const memberIndex = project.members.findIndex(
            member => member.user.toString() === userId
        );

        if (memberIndex === -1) {
            return res.status(404).json({ message: 'Member not found' });
        }

        project.members[memberIndex].role = role;
        await project.save();

        res.json({ message: 'Member role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating member', error: error.message });
    }
}; 