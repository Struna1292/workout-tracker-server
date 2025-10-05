import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import checkSync from '../middlewares/checkSync.js';
import checkDateQueryParams from '../middlewares/checkDateQueryParams.js';
import { 
    getUserExercises, 
    getGlobalExercises, 
    addUserExercise, 
    editUserExercise, 
    removeUserExercise 
} from '../controllers/exercisesController.js';


const router = express.Router();

// get user exercises
router.get('', [authToken, loadUser, checkDateQueryParams], getUserExercises);

// get global exercises
router.get('/global', getGlobalExercises);

// add user exercise
router.post('', [checkBody, authToken, loadUser, checkSync], addUserExercise);

// edit user exercise
router.put('/:id', [checkBody, authToken, loadUser, checkSync], editUserExercise);

// remove user exercise
router.delete('/:id', [authToken, loadUser, checkSync], removeUserExercise);

export default router;