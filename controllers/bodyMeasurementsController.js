import { validateMeasurement } from '../validations/bodyMeasurementValidations.js';

export const userMeasurements = async (req, res, next) => {
    try {

        const user = req.user;
        
        const measurements = await user.getBodyMeasurements();

        if (measurements.length == 0) {
            const err = new Error('User has no measurements');
            err.status = 404;
            return next(err); 
        }

        return res.status(200).json(measurements);
    }
    catch (error) {
        console.log(`Error while loading user measurements from database: ${error}`);
        const err = new Error('Internal server error while loading user measurements');
        err.status = 500;
        return next(err);
    }
};

export const addMeasurement = async (req, res, next) => {
    try {
        const newMeasurement = {
            weight: null,
            arm: null, 
            forearm: null, 
            chest: null,
            waist: null, 
            hips: null,
            thigh: null,
            calf: null,
            date: null
        };

        const measurementData = req.body;

        const errors = [];

        validateMeasurement(newMeasurement, measurementData, errors);

        if (errors.length > 0) {
            console.log('Failed to add measurement');
            const err = new Error('Failed to add measurement');
            err.status = 422;
            err.details = errors;
            return next(err);
        }

        const user = req.user;

        const measurement = await user.createBodyMeasurement(newMeasurement);

        console.log('Successfully added measurement');
        return res.status(201).json({ id: measurement.id, message: 'Successfully added measurement' });
    }
    catch (error) {
        console.log(`Error while trying to add new measurement: ${error}`);
        const err = new Error('Internal server error while trying to add new measurement');
        err.status = 500;
        return next(err);
    }
};

export const updateMeasurement = async (req, res, next) => {
    try {
        const measurementId = req.params.id;
        const measurementData = req.body;
        const user = req.user;

        const measurement = (await user.getBodyMeasurements({
            where: { id: measurementId },
            limit: 1
        }))[0];        
        
        if (!measurement) {
            console.log('Failed to update measurement. Measurement does not exist');
            const err = new Error('Failed to update measurement. Measurement does not exist');
            err.status = 404;
            return next(err);
        }

        const newMeasurement = {
            weight: null,
            arm: null, 
            forearm: null, 
            chest: null,
            waist: null, 
            hips: null,
            thigh: null,
            calf: null,
            date: null
        };

        const errors = [];

        validateMeasurement(newMeasurement, measurementData, errors);

        if (errors.length > 0) {
            console.log('Failed to update measurement');
            const err = new Error('Failed to update measurement');
            err.status = 422;
            err.details = errors;
            return next(err);
        }

        await measurement.update(newMeasurement);

        console.log('Successfully updated measurement');
        return res.status(200).json({ message: 'Successfully updated measurement' });
    }
    catch (error) {
        console.log(`Error while trying to update measurement: ${error}`);
        const err = new Error('Internal server error while updating measurement');
        err.status = 500;
        return next(err);
    }
};

export const removeMeasurement = async (req, res, next) => {
    try {
        const measurementId = req.params.id;

        const user = req.user;
        
        const measurement = (await user.getBodyMeasurements({
            where: { id: measurementId },
            limit: 1
        }))[0];

        if (!measurement) {
            console.log('Failed to remove measurement. Measurement does not exist');
            const err = new Error('Failed to remove measurement. Measurement does not exist');
            err.status = 404;
            return next(err);            
        }

        await measurement.destroy();

        console.log('Successfully removed measurement');
        return res.status(204).json({ message: 'Successfully removed measurement' });
    }
    catch (error) {
        console.log(`Error while trying to remove measurement by id: ${error}`);
        const err = new Error('Internal server error while trying to remove measurement');
        err.status = 500;
        return next(err);
    }
};