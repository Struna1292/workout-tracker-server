import WorkoutTemplate from '../models/WorkoutTemplate.js';
import Exercise from '../models/Exercise.js';
import { Op } from 'sequelize';

export const userWorkoutTemplates = async (req, res, next) => {
    try {
        const user = req.user;

        const templates = await user.getWorkoutTemplates();

        return res.status(200).json(templates);
    }
    catch (error) {
        console.log(`Error while trying to get user templates: ${error}`);
        const err = new Error('Internal server error while trying to get user templates');
        err.status = 500;
        return next(err);
    }
};

export const userWorkoutTemplateDetails = async (req, res, next) => {
    try {

        const templateId = req.params.id;
        const user = req.user;

        const template = (await user.getWorkoutTemplates({ where: { id: templateId } }))[0];
        const exercises = await template.getExercises();

        const sortedExercises = new Array(exercises.length);

        for (const exercise of exercises) {
            const position = exercise.WorkoutTemplateExercise.position;
            sortedExercises[position] = exercise.name;
        }

        const templateData = {
            templateId: template.id,
            name: template.name,
            exercises: sortedExercises
        };

        
        return res.status(200).json(templateData);
    }
    catch (error) {
        console.log(`Error while trying to load user workout template detailed informations: ${error}`);
        const err = new Error('Internal server error while loading workout template details');
        err.status = 500;
        return next(err);
    }
};

const validateTemplate = (name, templates, errors) => {

    // check name length
    if (name.length == 0 || name.length >= 256) {
        errors.push('Template name length must be between 1 or 255 characters long');
        return false;
    }

    const currName = name.toLowerCase();

    // check characters
    for (const char of currName) {
        if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == ' ')) {
            errors.push('Template name can contain only english letters, digits, and spaces');
            return false;
        }
    }

    // check if it already exists
    for (const template of templates) {
        if (template.name.toLowerCase() == currName) {
            errors.push('Template with this name already exists');
            return false;
        }
    }

    return true;
};

// maps given exercises names to exercises ids
const mapExercises = async (user, names) => {

    const globalExercises = await Exercise.findAll({ where: { user_id: null } });
    const userExercises = await user.getExercises();

    const map = new Map();

    // setup map with keys of given exercises names
    for (const name of names) {
        map.set(name.toLowerCase(), undefined);
    }

    // assign global exercises ids
    for (const exercise of globalExercises) {
        const currName = exercise.name.toLowerCase();
        if (map.has(currName)) {
            map.set(currName, exercise.dataValues.id);
        }
    }

    // assign user exercises ids
    for (const exercise of userExercises) {
        const currName = exercise.name.toLowerCase();
        if (map.has(currName)) {
            map.set(currName, exercise.dataValues.id);
        }      
    }

    const ids = [];

    // push found exercises ids
    for (let [key, value] of map) {
        if (value != undefined) {
            ids.push(value);
        }
    }

    
    return ids;
};

export const addWorkoutTemplate = async (req, res, next) => {
    try {

        const { name, exercises } = req.body;

        if (!name) {
            console.log('Failed to add new template, template needs a name.');
            const err = new Error('Failed to add new template, template needs a name.');
            err.status = 400;
            return next(err);
        }

        const user = req.user;

        const exercisesIds = await mapExercises(user, exercises);

        const templates = await user.getWorkoutTemplates();

        const errors = [];

        if (validateTemplate(name, templates, errors)) {

            const template = await user.createWorkoutTemplate({ name: name });

            let currPosition = 0;
            for (const currId of exercisesIds) {
                await template.addExercise(currId, { through: { position: currPosition } });
                currPosition++;
            }
            
            return res.status(200).json({ message: 'Successfully added new workout template' });
        }
        else {
            console.log(`Failed to add new template, ${errors[0]}`);
            const err = new Error(`Failed to add new template, ${errors[0]}`);
            err.status = 400;
            return next(err);
        }
    }
    catch (error) {
        console.log(`Error while adding new workout template: ${error}`);
        const err = new Error('Internal server error while adding new workout template');
        err.status = 500;
        return next(err);
    }
};

export const updateWorkoutTemplate = async (req, res, next) => {
    try {

        const { name, exercises } = req.body;
        
        if (!name) {
            console.log('Failed to edit template, no data');
            const err = new Error('Failed to edit template, no data');
            err.status = 400;
            return next(err);
        }

        const templateId = req.params.id;

        const template = await WorkoutTemplate.findByPk(templateId);

        if (!template || template.user_id != req.user.id) {
            console.log('Failed to edit template, template not found');
            const err = new Error('Failed to edit template, template not found');
            err.status = 404;
            return next(err);
        }

        const templates = await WorkoutTemplate.findAll({ where: { id: { [Op.not]: templateId }, user_id: req.user.id}});

        const errors = [];
        
        if (validateTemplate(name, templates, errors)) {

            template.name = name;

            // if user provided exercises change them
            if (exercises) {
                const exercisesIds = await mapExercises(req.user, exercises);
                
                // clear current exercises
                await template.setExercises([]);

                // setup new exercises
                let currPosition = 0;
                for (const currId of exercisesIds) {
                    await template.addExercise(currId, { through: { position: currPosition } });
                    currPosition++;
                }                
            }

            await template.save();

            return res.status(200).json({ message: 'Successfully edited workout template' });
        }
        else {
            console.log(`Failed to edit template, ${errors[0]}`);
            const err = new Error(`Failed to edit template, ${errors[0]}`);
            err.status = 400;
            return next(err);            
        }
    }
    catch (error) {
        console.log(`Error while trying to udpate template: ${error}`);
        const err = new Error('Internal server error while trying to update template');
        err.status = 500;
        return next(err);
    }
};

export const removeWorkoutTemplate = async (req, res, next) => {
    try {
        const templateId = req.params.id;

        const template = await WorkoutTemplate.findByPk(templateId);

        if (!template || template.user_id != req.user.id) {
            console.log('Failed to remove user template, template not found');
            const err = new Error('Failed to remove user template, template not found');
            err.status = 404;
            return next(err);
        }

        await template.destroy();

        return res.status(200).json({ message: 'Successfully removed user workout template' });
    }
    catch (error) {
        console.log(`Error while trying to remove workout template: ${error}`);
        const err = new Error('Internal server error while removing workout template');
        err.status = 500;
        return next(err);
    }
};