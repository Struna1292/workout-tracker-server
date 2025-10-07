import { validateMeasurement } from '../validations/bodyMeasurementValidations.js';
import { Op } from 'sequelize';

export const userMeasurements = async (req, res, next) => {
    try {

        const user = req.user;

        let offset = parseInt(req.query.offset) || 0;
        let limit = parseInt(req.query.limit) || 100;

        if (offset < 0) {
            offset = 0;
        }

        if (limit < 0 || limit > 100) {
            limit = 100;
        }

        let startDate = req.startDate;
        let endDate = req.endDate;

        let measurements;
        // startDate provided
        if (startDate) {
            measurements = await user.getBodyMeasurements({
                offset: offset, 
                limit: limit + 1,
                where: {
                    updated_at: {
                        [Op.gt]: startDate
                    },
                    updated_at: {
                        [Op.lte]: endDate
                    },
                },
            });
        }
        else {
            measurements = await user.getBodyMeasurements({
                offset: offset, 
                limit: limit + 1,
                where: {
                    updated_at: {
                        [Op.lte]: endDate
                    },
                },
            });
        }

        if (measurements.length == 0) {
            console.log(`No measurements found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            const err = new Error(`No measurements found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            err.status = 404;
            return next(err);
        }

        const respObj = {
            has_more: false,
            data: []
        };

        if (measurements.length > limit) {
            respObj.has_more = true;
            // pop last one that was loaded to check if there is more
            measurements.pop();
        }

        // format output data
        for (const measurement of measurements) {
            if (measurement.deleted_at != null) {
                respObj.data.push({
                    id: measurement.id,
                    deleted: true,
                });
            }
            else {
                respObj.data.push({
                    id: measurement.id,
                    deleted: false,
                    weight: measurement.weight,
                    arm: measurement.arm,
                    forearm: measurement.forearm,
                    chest: measurement.chest,
                    waist: measurement.waist,
                    hips: measurement.hips,
                    thigh: measurement.thigh,
                    calf: measurement.calf,
                    date: measurement.date,
                });
            }
        }

        return res.status(200).json(respObj);
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

        user.last_sync = measurement.updated_at;
        await user.save();

        console.log('Successfully added measurement');
        return res.status(201).json({ id: measurement.id, message: 'Successfully added measurement', last_sync: user.last_sync });
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
            where: { id: measurementId, deleted_at: null },
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

        user.last_sync = measurement.updated_at;
        await user.save();        

        console.log('Successfully updated measurement');
        return res.status(200).json({ message: 'Successfully updated measurement', last_sync: user.last_sync });
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
            where: { id: measurementId, deleted_at: null },
            limit: 1
        }))[0];

        if (!measurement) {
            console.log('Failed to remove measurement. Measurement does not exist');
            const err = new Error('Failed to remove measurement. Measurement does not exist');
            err.status = 404;
            return next(err);            
        }

        await measurement.update({ deleted_at: new Date() });

        user.last_sync = measurement.deleted_at;
        await user.save();

        console.log('Successfully removed measurement');
        return res.status(200).json({ message: 'Successfully removed measurement', last_sync: user.last_sync });
    }
    catch (error) {
        console.log(`Error while trying to remove measurement by id: ${error}`);
        const err = new Error('Internal server error while trying to remove measurement');
        err.status = 500;
        return next(err);
    }
};