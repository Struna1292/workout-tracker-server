import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import { 
    addWorkoutTemplate, 
    userWorkoutTemplateDetails, 
    removeWorkoutTemplate, 
    userWorkoutTemplates, 
    updateWorkoutTemplate 
} from '../controllers/workoutTemplatesController.js';

const router = express.Router();

// get user templates names 
router.get('', [authToken, loadUser], userWorkoutTemplates);

// get single user template by id with exercises info
router.get('/:id', [authToken, loadUser], userWorkoutTemplateDetails);

// add new user template
router.post('', [checkBody, authToken, loadUser], addWorkoutTemplate); 

// edit template
router.put('/:id', [checkBody, authToken, loadUser], updateWorkoutTemplate);

// remove user template
router.delete('/:id', [authToken, loadUser], removeWorkoutTemplate);

export default router;