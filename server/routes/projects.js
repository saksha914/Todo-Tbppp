import express from 'express';
import { body } from 'express-validator';
import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    updateProjectMember
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.post('/', authenticate, createProject);
router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProject);
router.put('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);
router.put('/:id/members', authenticate, updateProjectMember);

export default router; 