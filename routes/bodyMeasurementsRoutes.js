import express from 'express';
import checkBody from '../middlewares/checkBody.js';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import checkSync from '../middlewares/checkSync.js';
import checkDateQueryParams from '../middlewares/checkDateQueryParams.js';
import { 
    userMeasurements, 
    addMeasurement, 
    updateMeasurement, 
    removeMeasurement 
} from '../controllers/bodyMeasurementsController.js';

const router = express.Router();

// get user measurements
router.get('', [authToken, loadUser, checkDateQueryParams], userMeasurements);

// add new measurement for logged in user
router.post('', [checkBody, authToken, loadUser, checkSync], addMeasurement);

// update measurement
router.put('/:id', [checkBody, authToken, loadUser, checkSync], updateMeasurement);

// remove measurement
router.delete('/:id', [authToken, loadUser, checkSync], removeMeasurement);

export default router;