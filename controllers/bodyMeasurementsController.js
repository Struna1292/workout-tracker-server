import User from '../models/User.js';

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

const validateNewMeasure = (reqBody, errors) => {
    if (!reqBody) {
        return undefined;
    }

    const validated = {
        weight: undefined,
        arm: undefined, 
        forearm: undefined, 
        chest: undefined,
        waist: undefined, 
        hips: undefined,
        thigh: undefined,
        calf: undefined
    };

    // check if there is atleast one valid parameter
    let validParameter = false;

    for (let key in validated) {
        if (reqBody[key]) {
            const value = reqBody[key];

            if (value > 0) {
                validated[key] = reqBody[key];
                validParameter = true;
            }
            else {
                // add error information
                errors.push(`${key} needs to be positive number`);
            }
        }           
    }
    
    if (!validParameter) {
        return undefined;
    }

    return validated;
};


export const addMeasurement = async (req, res, next) => {
    try {
        const errors = [];

        const data = validateNewMeasure(req.body, errors);

        if (!data) {
            console.log('Failed to create measurement there is no valid data');
            let message = 'Cant create new user measurement without any valid data.';
            for (const error of errors) {
                message += '\n' + error;
            }   
            const err = new Error(message);
            err.status = 422;
            return next(err);
        }

        const user = req.user;

        const measurement = await user.createBodyMeasurement(data);

        return res.status(201).json({ id: measurement.id, message: 'successfully created new measure' });        
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

        const errors = [];

        const data = validateNewMeasure(req.body, errors);

        if (!data) {
            console.log('Failed to update measurement there is no valid data');
            let message = 'Cant update user measurement without any valid data.';
            for (const error of errors) {
                message += '\n' + error;
            }   
            const err = new Error(message);
            err.status = 422;
            return next(err);
        }

        await measurement.update(data);

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