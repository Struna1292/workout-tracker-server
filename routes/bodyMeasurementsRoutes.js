import express from 'express';
import authToken from '../middlewares/authToken.js';
import loadUser from '../middlewares/loadUser.js';
import { userMeasurements, addMeasurement, updateMeasurement, removeMeasurement } from '../controllers/bodyMeasurementsController.js';

const router = express.Router();

// get user measurements
router.get('', [authToken, loadUser], userMeasurements);

// add new measure for logged in user
router.post('', [authToken, loadUser], addMeasurement);

// update measure
router.put('/:id', [authToken, loadUser], updateMeasurement);

// remove measure
router.delete('/:id', [authToken, loadUser], removeMeasurement);

export default router;