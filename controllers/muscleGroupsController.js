import MuscleGroup from '../models/MuscleGroup.js';

export const getMuscleGroups = async (req, res, next) => {
    try {   
        const groups = await MuscleGroup.findAll();

        return res.status(200).json(groups);
    }
    catch (error) {
        console.log(`Error while trying to load muscle grups: ${error}`);
        const err = new Error('Internal server error while trying to load muscle groups');
        err.status = 500;
        return next(err);
    }
};