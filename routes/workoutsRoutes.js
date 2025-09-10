import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import {
    getUserWorkouts, 
    addWorkout,
    editWorkout,
    removeWorkout
} from '../controllers/workoutsController.js';

const router = express.Router();

// get user workouts
router.get('', [authToken, loadUser], getUserWorkouts);

// add user workout
router.post('', [authToken, loadUser], addWorkout);

// edit user workout
router.put('/:id', [checkBody, authToken, loadUser], editWorkout);

// remove user workout
router.delete('/:id', [authToken, loadUser], removeWorkout);

export default router;