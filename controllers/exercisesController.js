import Exercise from '../models/Exercise.js';
import { Op } from 'sequelize';

export const getUserExercises = async (req, res, next) => {
    try {

        const user = req.user;

        const exercises = await user.getExercises();

        return res.status(200).json(exercises);
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

        return res.status(200).json(exercises);
    }
    catch (error) {
        console.log(`Error while trying to get load global exercises from db: ${error}`);
        const err = new Error('Internal server error while trying to get global exercises');
        err.status = 500;
        return next(err);
    }
};

const validateName = (name, exercises, errors) => {
    // check if there is name
    if (!name) {
        errors.push('exercise needs name');
        return false;
    }

    // check name length
    if (name.length == 0 || name.length >= 256) {
        errors.push('Exercise name length must be between 1 or 255 characters long');
        return false;
    }

    const currName = name.toLowerCase();

    // check characters
    for (const char of currName) {
        if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == ' ')) {
            errors.push('Exercise name can contain only english letters, digits, and spaces');
            return false;
        }
    }

    // check if it already exists
    for (const exercise of exercises) {
        if (exercise.name.toLowerCase() == currName) {
            errors.push('Exercise with this name already exists');
            return false;
        }
    }

    return true;
};

const validateDescription = (description, errors) => {

    if (description.length > 1000) {
        errors.push('description cant be longer than 1000 characters');
        return false;
    }

    return true;
};

export const addUserExercise = async (req, res, next) => {
    try {

        const data = req.body;

        const user = req.user;

        const exercises = await user.getExercises();
 
        const errors = [];

        validateName(data.name, exercises, errors);

        if (data.description) {
            validateDescription(data.description, errors);
        }
        else {
            data.description = '';
        }

        if (errors[0]) {
            console.log(`Failed to add new exercise, ${errors[0]}`);
            const err = new Error(`Failed to add new exercise, ${errors[0]}`);
            err.status = 400;
            return next(err);              
        }

        await user.createExercise({ name: data.name, description: data.description });
        
        return res.status(200).json({ message: 'Successfully added exercise' });
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
        if (!data.name && !data.description) {
            console.log('User did not sent any data for change');
            const err = new Error('There is no data to change, proper fields: name, description');
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