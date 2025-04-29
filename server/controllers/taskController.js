import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority,
            project,
        } = req.body;

        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            project,
            createdBy: req.user.id
        });

        await task.save();

        // If task is part of a project, update project's tasks array
        if (project) {
            await Project.findByIdAndUpdate(project, {
                $push: { tasks: task._id }
            });
        }


        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const {
            project,
            status,
            priority,
            dueDate,
            search,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (project) query.project = project;
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (dueDate) query.dueDate = { $lte: new Date(dueDate) };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query)
            .populate('project', 'name color')
            .populate('createdBy', 'username profile')
            .sort({ dueDate: 1, priority: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Task.countDocuments(query);

        res.json({
            tasks,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name color')
            .populate('createdBy', 'username profile')

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority,
            status,
            project,
        } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Update task
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.project = project || task.project;

        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Remove task from project if it exists
        if (task.project) {
            await Project.findByIdAndUpdate(task.project, {
                $pull: { tasks: task._id }
            });
        }

        await task.deleteOne();

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};

export const reorderTasks = async (req, res) => {
    try {
        const { tasks } = req.body;

        const updatePromises = tasks.map((task, index) =>
            Task.findByIdAndUpdate(task._id, { order: index })
        );

        await Promise.all(updatePromises);

        res.json({ message: 'Tasks reordered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error reordering tasks', error: error.message });
    }
}; 