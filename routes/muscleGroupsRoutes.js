import express from 'express';
import { getMuscleGroups } from '../controllers/muscleGroupsController.js';

const router = express.Router();

// get muscle groups
router.get('',  getMuscleGroups);

export default router;