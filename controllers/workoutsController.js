import Exercise from '../models/Exercise.js';
import WorkoutExercise from '../models/WorkoutExercise.js';
import { 
    validateTemplate, 
    validateDuration, 
    validateDate, 
    validateExercises 
} from '../validations/workoutValidations.js';

export const getUserWorkouts = async (req, res, next) => {
    try {
        const user = req.user;

        const workoutsData = [];

        const workouts = await user.getWorkouts();
        for (const workout of workouts) {

            const template = await workout.getTemplate();

            const currWorkout = {
                id: workout.id,
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

            workoutsData.push(currWorkout);
        }

        return res.status(200).json(workoutsData);
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

        console.log('Successfully added workout');
        return res.status(201).json({ id: workout.id, message: 'Successfully added workout' });
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

        const workout = (await user.getWorkouts({ where: { id: workoutId } }))[0];

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

        console.log('Successfully changed workout');
        return res.status(200).json({ message: 'Successfully changed workout' });
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

        const workout = (await user.getWorkouts({ where: {id: workoutId } }))[0];

        if (!workout) {
            console.log('Workout does not exist');
            const err = new Error('Workout does not exist');
            err.status = 404;
            return next(err);
        }

        await workout.destroy();
        console.log('Successfully removed workout');
        
        return res.status(200).json({ message: 'Successfully removed workout' });
    }   
    catch (error) {
        console.log(`Error while trying to remove workout`);
        const err = new Error('Internal serve error while trying to remove workout');
        err.status = 500;
        return next(err);
    }
};