import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import { getUserExercises, addUserExercise } from '../controllers/exercisesController.js';


const router = express.Router();

// get user exercises
router.get('', [authToken, loadUser], getUserExercises);

// get global exercises

// add user exercise
router.post('', [checkBody, authToken, loadUser], addUserExercise);

export default router;