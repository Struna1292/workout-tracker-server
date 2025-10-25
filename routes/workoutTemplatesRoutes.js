import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import checkSync from '../middlewares/checkSync.js';
import checkDateQueryParams from '../middlewares/checkDateQueryParams.js';
import { 
    addWorkoutTemplate, 
    removeWorkoutTemplate, 
    userWorkoutTemplates, 
    updateWorkoutTemplate 
} from '../controllers/workoutTemplatesController.js';

const router = express.Router();

// get user templates
router.get('', [authToken, loadUser, checkDateQueryParams], userWorkoutTemplates);

// add new user template
router.post('', [checkBody, authToken, loadUser, checkSync], addWorkoutTemplate); 

// edit template
router.put('/:id', [checkBody, authToken, loadUser, checkSync], updateWorkoutTemplate);

// remove user template
router.delete('/:id', [authToken, loadUser, checkSync], removeWorkoutTemplate);

export default router;