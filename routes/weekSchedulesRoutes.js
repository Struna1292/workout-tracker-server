import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkBody from '../middlewares/checkBody.js';
import checkSync from '../middlewares/checkSync.js';
import checkDateQueryParams from '../middlewares/checkDateQueryParams.js';
import {
    getUserWeekSchedules, 
    addWeekSchedule,
    editWeekSchedule,
    removeWeekSchedule
} from '../controllers/weekSchedulesController.js';

const router = express.Router();

// get user week schedules
router.get('', [authToken, loadUser, checkDateQueryParams], getUserWeekSchedules);

// add user week schedules
router.post('', [checkBody, authToken, loadUser, checkSync], addWeekSchedule);

// edit user week schedules
router.put('/:id', [checkBody, authToken, loadUser, checkSync], editWeekSchedule);

// remove user week schedules
router.delete('/:id', [authToken, loadUser, checkSync], removeWeekSchedule);

export default router;