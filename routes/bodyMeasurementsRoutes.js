import express from 'express';
import checkBody from '../middlewares/checkBody.js';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import { userMeasurements, addMeasurement, updateMeasurement, removeMeasurement } from '../controllers/bodyMeasurementsController.js';

const router = express.Router();

// get user measurements
router.get('', [authToken, loadUser], userMeasurements);

// add new measurement for logged in user
router.post('', [checkBody, authToken, loadUser], addMeasurement);

// update measurement
router.put('/:id', [checkBody, authToken, loadUser], updateMeasurement);

// remove measurement
router.delete('/:id', [authToken, loadUser], removeMeasurement);

export default router;