import Exercise from '../models/Exercise.js';
import { 
    validateTemplate, 
    validateDuration, 
    validateDate, 
    validateExercises 
} from '../validations/workoutValidations.js';

export const getUserWorkouts = async (req, res, next) => {
    try {
        const user = req.user; 

        let offset = parseInt(req.query.offset) || 0;
        let limit = parseInt(req.query.limit) || 5;

        if (offset < 0) {
            offset = 0;
        }

        if (limit < 0 || limit > 5) {
            limit = 5;
        }

        let startDate = req.startDate;
        let endDate = req.endDate;

        let workouts;
        // startDate provided
        if (startDate) {
            workouts = await user.getWorkouts({
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
            workouts = await user.getWorkouts({
                offset: offset, 
                limit: limit + 1,
                where: {
                    updated_at: {
                        [Op.lte]: endDate
                    },
                },
            });
        }

        if (workouts.length == 0) {
            console.log(`No workouts found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            const err = new Error(`No workouts found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            err.status = 404;
            return next(err);
        }

        const respObj = {
            has_more: false,
            data: []
        };

        if (workouts.length > limit) {
            respObj.has_more = true;
            // pop last one that was loaded to check if there is more
            workouts.pop();
        }

        for (const workout of workouts) {

            if (workout.deleted_at != null) {
                respObj.data.push({
                    id: workout.id,
                    deleted: true,
                });

                continue;
            }

            const template = await workout.getTemplate();

            const currWorkout = {
                id: workout.id,
                deleted: false,
                template: template ? template.name : null,
                duration: workout.duration,
                date: workout.date,
                exercises: []
            };

            const workoutExercises = await workout.getExercises();
            for (const exercise of workoutExercises) {

                const currExercise = {
                    id: exercise.id,
                    name: exercise.name,
                    position: exercise.WorkoutExercise.position,
                    sets: [],
                };

                const sets = await exercise.WorkoutExercise.getSets();
                for (const set of sets) {
                    currExercise.sets.push({ reps: set.reps, weight: set.weight });
                }

                currWorkout.exercises.push(currExercise);
            }

            respObj.push(currWorkout);
        }

        return res.status(200).json(respObj);
    }   
    catch (error) {
        console.log(`Error while trying to load user workouts: ${error}`);
        const err = new Error('Internal server error while trying to load workouts');
        err.status = 500;
        return next(err);
    }
};

export const addWorkout = async (req, res, next) => {
    try {

        const user = req.user;
        const workoutData = req.body;

        const templates = await user.getWorkoutTemplates();
        const templatesIdsSet = new Set(templates.map((t) => t.id));

        const userExercises = await user.getExercises();
        const globalExercises = await Exercise.findAll({ where: { user_id: null } });

        const exercisesIdsSet = new Set(userExercises.map((uE) => uE.id));

        for (const exercise of globalExercises) {
            exercisesIdsSet.add(exercise.id);
        }
        
        const newWorkout = {
            workout_template_id: null,
            duration: null,
            date: null,
            exercises: null,
        };

        const errors = [];

        validateTemplate(newWorkout, workoutData, errors, templatesIdsSet);

        validateDuration(newWorkout, workoutData, errors);

        validateDate(newWorkout, workoutData, errors);

        validateExercises(newWorkout, workoutData, errors, exercisesIdsSet);

        if (errors.length > 0) {
            console.log('Failed to add workout');
            const err = new Error('Failed to add workout');
            err.status = 422;
            err.details = errors;
            return next(err);
        }     

        const workout = await user.createWorkout(newWorkout);

        const exercises = newWorkout.exercises;

        for (let i = 0; i < exercises.length; i++) {
            await workout.addExercise(exercises[i].id, i, exercises[i].sets);
        }

        user.last_sync = workout.updated_at;
        await user.save();

        console.log('Successfully added workout');
        return res.status(201).json({ id: workout.id, message: 'Successfully added workout', last_sync: user.last_sync });
    }
    catch (error) {
        console.log(`Error while trying to add new workout: ${error}`);
        const err = new Error('Internal server error while adding workout');
        err.status = 500;
        return next(err);
    }
};

export const editWorkout = async (req, res, next) => {
    try {

        const workoutId = req.params.id;
        const user = req.user;

        const workout = (await user.getWorkouts({ where: { id: workoutId, deleted_at: null } }))[0];

        if (!workout) {
            console.log('Workout not found');
            const err = new Error('Workout not found');
            err.status = 404;
            return next(err);
        }

        const workoutData = req.body;

        const templates = await user.getWorkoutTemplates();
        const templatesIdsSet = new Set(templates.map((t) => t.id));

        const userExercises = await user.getExercises();
        const globalExercises = await Exercise.findAll({ where: { user_id: null } });

        const exercisesIdsSet = new Set(userExercises.map((uE) => uE.id));

        for (const exercise of globalExercises) {
            exercisesIdsSet.add(exercise.id);
        }
        
        const newWorkout = {
            workout_template_id: null,
            duration: null,
            date: null,
            exercises: null,
        };

        const errors = [];

        validateTemplate(newWorkout, workoutData, errors, templatesIdsSet);

        validateDuration(newWorkout, workoutData, errors);

        validateDate(newWorkout, workoutData, errors);

        validateExercises(newWorkout, workoutData, errors, exercisesIdsSet);

        if (errors.length > 0) {
            console.log('Failed to edit workout');
            const err = new Error('Failed to edit workout');
            err.status = 422;
            err.details = errors;
            return next(err);
        }     

        await workout.update(newWorkout);

        // clear previous exercises
        await workout.setExercises([]);

        const exercises = newWorkout.exercises;

        for (let i = 0; i < exercises.length; i++) {
            await workout.addExercise(exercises[i].id, i, exercises[i].sets);
        }

        user.last_sync = workout.updated_at;
        await user.save();

        console.log('Successfully changed workout');
        return res.status(200).json({ message: 'Successfully changed workout', last_sync: user.last_sync });
    }
    catch (error) {
        console.log(`Error while trying to edit workout: ${error}`);
        const err = new Error('Internal server error while editing workout');
        err.status = 500;
        return next(err);
    }
};

export const removeWorkout = async (req, res, next) => {
    try {

        const workoutId = req.params.id;
        const user = req.user;

        const workout = (await user.getWorkouts({ where: {id: workoutId, deleted_at: null } }))[0];

        if (!workout) {
            console.log('Workout does not exist');
            const err = new Error('Workout does not exist');
            err.status = 404;
            return next(err);
        }

        await workout.update({ deleted_at: new Date() });

        user.last_sync = workout.deleted_at;
        await user.save();

        console.log('Successfully removed workout');
        return res.status(200).json({ message: 'Successfully removed workout', last_sync: user.last_sync });
    }   
    catch (error) {
        console.log(`Error while trying to remove workout`);
        const err = new Error('Internal serve error while trying to remove workout');
        err.status = 500;
        return next(err);
    }
};