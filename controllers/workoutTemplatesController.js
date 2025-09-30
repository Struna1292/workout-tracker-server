import WorkoutTemplate from '../models/WorkoutTemplate.js';
import Exercise from '../models/Exercise.js';
import WorkoutTemplateExercise from '../models/WorkoutTemplateExercise.js';
import { Op } from 'sequelize';
import { validateName, validateExercises } from '../validations/templateValidations.js';

export const userWorkoutTemplates = async (req, res, next) => {
    try {
        const user = req.user;

        const templates = await user.getWorkoutTemplates();
        const templatesData = [];

        for (const template of templates) {
            const exercises = await template.getExercises();
            const exercisesData = new Array(exercises.length);

            for (const exercise of exercises) {
                exercisesData[exercise.WorkoutTemplateExercise.position] = exercise.name;
            }

            templatesData.push({
                id: template.id,
                name: template.name,
                exercises: exercisesData,
            });
        }

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

export const addWorkoutTemplate = async (req, res, next) => {
    try {

        const templateData = req.body;
        const user = req.user;
        const templates = await user.getWorkoutTemplates();
        const userExercises = await user.getExercises();
        const globalExercises = await Exercise.findAll({ where: { user_id: null } });

        const templatesNamesSet = new Set(templates.map((t) => t.name.toLowerCase()));
        const exercisesIdsSet = new Set(userExercises.map((uE) => uE.id));

        for (const exercise of globalExercises) {
            exercisesIdsSet.add(exercise.id);
        }

        const newTemplate = {
            name: null,
            exercises: null,
        };

        const errors = [];

        validateName(newTemplate, templateData, errors, templatesNamesSet);

        validateExercises(newTemplate, templateData, errors, exercisesIdsSet);        

        if (errors.length > 0) {
            console.log('Failed to add new template');
            const err = new Error('Failed to add new template');
            err.status = 422;
            err.details = errors;
            return next(err);
        }

        const template = await user.createWorkoutTemplate(newTemplate);

        const exercises = newTemplate.exercises;
        for (let i = 0; i < exercises.length; i++) {
            await template.addExercise(exercises[i], i);
        }

        console.log('Successfully added workout template');
        return res.status(201).json({ id: template.id, message: 'Successfully added workout template' });
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

        const user = req.user;
        const templateId = req.params.id;

        const template = (await user.getWorkoutTemplates({ where: { id: templateId } }))[0];

        if (!template) {
            console.log('Failed to edit template, template not found');
            const err = new Error('Failed to edit template, template not found');
            err.status = 404;
            return next(err);
        }

        const templateData = req.body;

        const userExercises = await user.getExercises();
        const globalExercises = await Exercise.findAll({ where: { user_id: null } });

        const exercisesIdsSet = new Set(userExercises.map((uE) => uE.id));

        for (const exercise of globalExercises) {
            exercisesIdsSet.add(exercise.id);
        }
        
        // all user templates without one to edit
        const templates = await user.getWorkoutTemplates({ where: { id: { [Op.not]: templateId } }});

        const templatesNamesSet = new Set(templates.map((t) => t.name.toLowerCase()));

        const newTemplate = {
            name: null,
            exercises: null,
        };

        const errors = [];

        validateName(newTemplate, templateData, errors, templatesNamesSet);

        validateExercises(newTemplate, templateData, errors, exercisesIdsSet);             

        if (errors.length > 0) {
            console.log('Failed to edit template');
            const err = new Error('Failed to edit template');
            err.status = 422;
            err.details = errors;
            return next(err);
        }

        await template.update(newTemplate);

        // clear previous exercises
        await template.setExercises([]);

        const exercises = newTemplate.exercises;
        for (let i = 0; i < exercises.length; i++) {
            await template.addExercise(exercises[i], i);
        }

        console.log('Successfully edited workout template');
        return res.status(200).json({ message: 'Successfully edited workout template' });
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