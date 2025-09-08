import express from 'express';
import authToken from '../middlewares/authToken.js';
import { addWorkoutTemplate, removeWorkoutTemplate, userWorkoutTemplates, updateWorkoutTemplate } from '../controllers/workoutTemplatesController.js';

const router = express.Router();

// get user templates
router.get('', authToken, userWorkoutTemplates);

// add new user template
router.post('', authToken, addWorkoutTemplate);

// edit template
router.put('/:id', authToken, updateWorkoutTemplate);

// remove user template
router.delete('/:id', authToken, removeWorkoutTemplate);

export default router;