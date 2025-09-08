import express from 'express';
import authToken from '../middlewares/authToken.js';
import { userMeasurements, addMeasurement, updateMeasurement, removeMeasurement } from '../controllers/bodyMeasurementsController.js';

const router = express.Router();

// get user measurements
router.get('', authToken, userMeasurements);

// add new measure for logged in user
router.post('', authToken, addMeasurement);

// update measure
router.put('/:id', authToken, updateMeasurement);

// remove measure
router.delete('/:id', authToken, removeMeasurement);

export default router;