import Exercise from '../models/Exercise.js';
import MuscleGroups from '../models/MuscleGroup.js';
import { Op } from 'sequelize';
import { 
    validateName, 
    validateDescription, 
    validateMuscleGroups 
} from '../validations/exerciseValidations.js';

export const getUserExercises = async (req, res, next) => {
    try {

        const user = req.user;

        let offset = parseInt(req.query.offset) || 0;
        let limit = parseInt(req.query.limit) || 20;

        if (offset < 0) {
            offset = 0;
        }

        if (limit < 0 || limit > 20) {
            limit = 20;
        }

        let startDate = req.startDate;
        let endDate = req.endDate;

        let exercises;
        // startDate provided
        if (startDate) {
            exercises = await user.getExercises({
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
            exercises = await user.getExercises({
                offset: offset, 
                limit: limit + 1,
                where: {
                    updated_at: {
                        [Op.lte]: endDate
                    },
                },
            });
        }

        if (exercises.length == 0) {
            console.log(`No exercises found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            const err = new Error(`No exercises found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            err.status = 404;
            return next(err);
        }

        const respObj = {
            has_more: false,
            data: []
        };

        if (exercises.length > limit) {
            respObj.has_more = true;
            // pop last one that was loaded to check if there is more
            exercises.pop();
        }

        // format output data
        for (const exercise of exercises) {
            const muscleGroups = await exercise.getMuscleGroups();

            if (exercise.deleted_at != null) {
                respObj.data.push({
                    id: exercise.id,
                    deleted: true,
                });
            }
            else {
                respObj.data.push({
                    id: exercise.id,
                    name: exercise.name,
                    description: exercise.description,
                    muscleGroups: muscleGroups.map((mG) => (mG.id))
                });
            }
        }        

        return res.status(200).json(respObj);
    }
    catch (error) {
        console.log(`Error while trying to get user exercises: ${error}`);
        const err = new Error('Internal server error while trying to get user exercises');
        err.status = 500;
        return next(err);
    }
};

export const getGlobalExercises = async (req, res, next) => {
    try {

        let offset = parseInt(req.query.offset) || 0;
        let limit = parseInt(req.query.limit) || 20;

        if (offset < 0) {
            offset = 0;
        }

        if (limit < 0 || limit > 20) {
            limit = 20;
        }

        const exercises = await Exercise.findAll({ where: { user_id: null }, offset: offset, limit: limit });

        const exercisesData = [];
        for (const exercise of exercises) {
            const muscleGroups = await exercise.getMuscleGroups();

            exercisesData.push({
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                muscleGroups: muscleGroups.map((mG) => (mG.id))
            });
        }

        if (exercisesData.length == 0) {
            console.log(`No exercises found with offset: ${offset}, limit: ${limit}`);
            const err = new Error(`No exercises found with offset: ${offset}, limit: ${limit}`);
            err.status = 404;
            return next(err);
        }

        return res.status(200).json(exercisesData);
    }
    catch (error) {
        console.log(`Error while trying to get load global exercises from db: ${error}`);
        const err = new Error('Internal server error while trying to get global exercises');
        err.status = 500;
        return next(err);
    }
};

const getExercisesNamesSet = (userExercises, globalExercises) => {
    const exercisesNamesSet = new Set();

    for (const exercise of userExercises) {
        const currName = exercise.name.toLowerCase();
        exercisesNamesSet.add(currName);
    }

    for (const exercise of globalExercises) {
        const currName = exercise.name.toLowerCase();
        exercisesNamesSet.add(currName);
    }

    return exercisesNamesSet;
};

export const addUserExercise = async (req, res, next) => {
    try {

        const exerciseData = req.body;
        const user = req.user;
        const userExercises = await user.getExercises();
        const globalExercises = await Exercise.findAll({ where: { user_id: null } });
        const muscleGroups = await MuscleGroups.findAll();
 
        const exercisesNamesSet = getExercisesNamesSet(userExercises, globalExercises);
        const muscleGroupsIdsSet = new Set(muscleGroups.map((mG) => mG.id));
        
        const newExercise = {
            name: null,
            description: null,
            muscleGroups: null
        };

        const errors = [];

        validateName(newExercise, exerciseData, errors, exercisesNamesSet);

        validateDescription(newExercise, exerciseData, errors);

        validateMuscleGroups(newExercise, exerciseData, errors, muscleGroupsIdsSet);

        if (errors.length > 0) {
            console.log('Failed to add new exercise');
            const err = new Error('Failed to add new exercise');
            err.status = 422;
            err.details = errors;
            return next(err);
        }

        const exercise = await user.createExercise(newExercise);
        await exercise.setMuscleGroups(newExercise.muscleGroups);

        user.last_sync = exercise.last_sync;
        await user.save();        
        
        return res.status(201).json({ id: exercise.id, message: 'Successfully added exercise', last_sync: user.last_sync });
    }
    catch (error) {
        console.log(`Error while trying to add new exercise: ${error}`);
        const err = new Error('Internal server error while trying to add new exercise');
        err.status = 500;
        return next(err);
    }
};

export const editUserExercise = async (req, res, next) => {
    try {
        const exerciseId = req.params.id;
        const user = req.user;

        // user exercise to edit
        const exercise = (await user.getExercises({ where: { id: exerciseId, deleted_at: null }}))[0];

        if (!exercise) {
            console.log('Exercise to edit not found');
            const err = new Error('Exercise does not exist');
            err.status = 404;
            return next(err);
        }

        const exerciseData = req.body;

        // all user exercises except the one to be edited
        const userExercises = await user.getExercises({ where: { id: { [Op.not]: exerciseId } }});
        const globalExercises = await Exercise.findAll({ where: { user_id: null } });
        const muscleGroups = await MuscleGroups.findAll();

        const exercisesNamesSet = getExercisesNamesSet(userExercises, globalExercises);
        const muscleGroupsIdsSet = new Set(muscleGroups.map((mG) => mG.id));

        const newExercise = {
            name: null,
            description: null,
            muscleGroups: null
        };        

        const errors = [];

        validateName(newExercise, exerciseData, errors, exercisesNamesSet);

        validateDescription(newExercise, exerciseData, errors);

        validateMuscleGroups(newExercise, exerciseData, errors, muscleGroupsIdsSet);

        if (errors.length > 0) {
            console.log('Failed to edit exercise');
            const err = new Error('Failed to edit exercise');
            err.status = 422;
            err.details = errors;
            return next(err);
        }

        await exercise.update(newExercise);
        await exercise.setMuscleGroups(newExercise.muscleGroups);

        user.last_sync = measurement.updated_at;
        await user.save();

        return res.status(200).json({ message: 'Successfully edited exercise', last_sync: user.last_sync });
    }
    catch (error) {
        console.log(`Error while trying to edit user exercise: ${error}`);
        const err = new Error('Internal server error while trying to edit exercise');
        err.status = 500;
        return next(err);
    }
};

export const removeUserExercise = async (req, res, next) => {
    try {
        
        const user = req.user;
        const exerciseId = req.params.id;

        const exercise = (await user.getExercises({ where: { id: exerciseId, deleted_at: null }}))[0];

        if (!exercise) {
            console.log('Exercise to remove not found');
            const err = new Error('Exercise does not exist');
            err.status = 404;
            return next(err);
        }

        await exercise.update({ deleted_at: new Date() });

        user.last_sync = exercise.deleted_at;
        await user.save();

        return res.status(200).json({ message: 'Successfully removed user exercise', last_sync: user.last_sync});
    }
    catch (error) {
        console.log(`Error while trying to remove user exercise: ${error}`);
        const err = new Error('Internal server error while trying to remove exercise');
        err.status = 500;
        return next(err);
    }
};