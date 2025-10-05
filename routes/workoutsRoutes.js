import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import checkSync from '../middlewares/checkSync.js';
import checkDateQueryParams from '../middlewares/checkDateQueryParams.js';
import {
    getUserWorkouts, 
    addWorkout,
    editWorkout,
    removeWorkout
} from '../controllers/workoutsController.js';

const router = express.Router();

// get user workouts
router.get('', [authToken, loadUser, checkDateQueryParams], getUserWorkouts);

// add user workout
router.post('', [checkBody, authToken, loadUser, checkSync], addWorkout);

// edit user workout
router.put('/:id', [checkBody, authToken, loadUser, checkSync], editWorkout);

// remove user workout
router.delete('/:id', [authToken, loadUser, checkSync], removeWorkout);

export default router;