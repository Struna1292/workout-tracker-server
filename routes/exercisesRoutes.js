import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import { getUserExercises, getGlobalExercises, addUserExercise, editUserExercise, removeUserExercise } from '../controllers/exercisesController.js';


const router = express.Router();

// get user exercises
router.get('', [authToken, loadUser], getUserExercises);

// get global exercises
router.get('/global', getGlobalExercises);

// add user exercise
router.post('', [checkBody, authToken, loadUser], addUserExercise);

// edit user exercise
router.put('/:id', [checkBody, authToken, loadUser], editUserExercise);

// remove user exercise
router.delete('/:id', [authToken, loadUser], removeUserExercise);

export default router;