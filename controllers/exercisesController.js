import Exercise from '../models/Exercise.js';
import MuscleGroups from '../models/MuscleGroup.js';
import { Op } from 'sequelize';
import { validateName, validateDescription, validateMuscleGroups } from '../validations/exerciseValidations.js';

export const getUserExercises = async (req, res, next) => {
    try {

        const user = req.user;

        const exercises = await user.getExercises();

        const exercisesData = [];
        for (const exercise of exercises) {
            const muscleGroups = await exercise.getMuscleGroups();

            exercisesData.push({
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                muscleGroups: muscleGroups.map((mG) => (mG.name))
            });
        }

        return res.status(200).json(exercisesData);
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

        const exercises = await Exercise.findAll({ where: { user_id: null } });

        const exercisesData = [];
        for (const exercise of exercises) {
            const muscleGroups = await exercise.getMuscleGroups();

            exercisesData.push({
                id: exercise.id,
                name: exercise.name,
                description: exercise.description,
                muscleGroups: muscleGroups.map((mG) => (mG.name))
            });
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
        
        return res.status(200).json({ id: exercise.id, message: 'Successfully added exercise' });
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
        const data = req.body;

        // check if user sent any proper data to change
        if (!data.name && !data.description && !data.muscleGroups) {
            console.log('User did not sent any data for change');
            const err = new Error('There is no data to change, proper fields: name, description, muscleGroups');
            err.status = 400;
            return next(err);
        }

        const exerciseId = req.params.id;

        const user = req.user;

        // all user exercises except the one to be edited
        const exercises = await user.getExercises({ where: { id: { [Op.not]: exerciseId } }});
        // user exercise to edit
        const exercise = (await user.getExercises({ where: { id: exerciseId }}))[0];

        if (!exercise) {
            console.log('Exercise to edit not found');
            const err = new Error('Exercise does not exist');
            err.status = 404;
            return next(err);
        }

        const errors = [];

        if (data.name && validateName(data.name, exercises, errors)) {
            exercise.name = data.name;
        }

        if (data.description && validateDescription(data.description, errors)) {
            exercise.description = data.description;
        }

        if (errors[0]) {
            console.log(`Failed to edit exercise, ${errors[0]}`);
            const err = new Error(`Failed to edit exercise, ${errors[0]}`);
            err.status = 400;
            return next(err);              
        }

        if (data.muscleGroups) {
            const groups = await mapMuscleGroups(data.muscleGroups);

            // clear current muscle groups
            await exercise.setMuscleGroups([]);

            // set new muscle groups
            await exercise.setMuscleGroups(groups);
        }

        await exercise.save();

        return res.status(200).json({ message: 'Successfully edited exercise' });
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

        const exercise = (await user.getExercises({ where: { id: exerciseId }}))[0];

        if (!exercise) {
            console.log('Exercise to remove not found');
            const err = new Error('Exercise does not exist');
            err.status = 404;
            return next(err);
        }

        await exercise.destroy();

        return res.status(200).json({ message: "Successfully removed user exercise "});
    }
    catch (error) {
        console.log(`Error while trying to remove user exercise: ${error}`);
        const err = new Error('Internal server error while trying to remove exercise');
        err.status = 500;
        return next(err);
    }
};