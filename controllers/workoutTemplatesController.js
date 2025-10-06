import Exercise from '../models/Exercise.js';
import { Op } from 'sequelize';
import { 
    validateName, 
    validateExercises,
} from '../validations/templateValidations.js';

export const userWorkoutTemplates = async (req, res, next) => {
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

        let templates;
        // startDate provided
        if (startDate) {
            measurements = await user.getWorkoutTemplates({
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
            measurements = await user.getWorkoutTemplates({
                offset: offset, 
                limit: limit + 1,
                where: {
                    updated_at: {
                        [Op.lte]: endDate
                    },
                },
            });
        }

        const respObj = {
            has_more: false,
            data: []
        };

        if (templates.length > limit) {
            respObj.has_more = true;
            // pop last one that was loaded to check if there is more
            templates.pop();
        }

        for (const template of templates) {
            if (template.deleted_at != null) {
                respObj.data.push({
                    id: template.id,
                    deleted: true,
                });

                continue;
            }            

            const exercises = await template.getExercises();
            const exercisesData = new Array(exercises.length);

            for (const exercise of exercises) {
                exercisesData[exercise.WorkoutTemplateExercise.position] = exercise.id;
            }

            respObj.push({
                id: template.id,
                deleted: false,
                name: template.name,
                exercises: exercisesData,
            });
        }

        return res.status(200).json(respObj);
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

        user.last_sync = template.last_sync;
        await user.save();

        console.log('Successfully added workout template');
        return res.status(201).json({ id: template.id, message: 'Successfully added workout template', last_sync: user.last_sync });
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

        const template = (await user.getWorkoutTemplates({ where: { id: templateId, deleted_at: null } }))[0];

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

        user.last_sync = template.updated_at;
        await user.save();           

        console.log('Successfully edited workout template');
        return res.status(200).json({ message: 'Successfully edited workout template', last_sync: user.last_sync });
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

        const template = (await user.getWorkoutTemplates({
            where: { id: templateId, deleted_at: null },
            limit: 1
        }))[0];

        if (!template) {
            console.log('Failed to remove user template, template not found');
            const err = new Error('Failed to remove user template, template not found');
            err.status = 404;
            return next(err);
        }

        await template.update({ deleted_at: new Date() });

        user.last_sync = template.deleted_at;
        await user.save();

        return res.status(200).json({ message: 'Successfully removed user workout template', last_sync: user.last_sync });
    }
    catch (error) {
        console.log(`Error while trying to remove workout template: ${error}`);
        const err = new Error('Internal server error while removing workout template');
        err.status = 500;
        return next(err);
    }
};