import Exercise from '../models/Exercise.js';
import WorkoutExercise from '../models/WorkoutExercise.js';
import Set from '../models/Set.js';

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

// maps global and user exercises where key is name, value is exercise object
const mapExercises = async (user) => {

    const globalExercises = await Exercise.findAll({ where: { user_id: null } });
    const userExercises = await user.getExercises();

    const map = new Map();

    for (const exercise of globalExercises) {
        const currName = exercise.name.toLowerCase();
        map.set(currName, exercise);
    }

    for (const exercise of userExercises) {
        const currName = exercise.name.toLowerCase();
        map.set(currName, exercise);
    }    

    return map;
};

export const addWorkout = async (req, res, next) => {
    try {

        const user = req.user;

        if (!req.body) {
            await user.createWorkout();

            return res.status(200).json({ message: 'Successfully added workout' });
        }
        
        const workoutData = {};

        if (req.body.templateName) {
            const name = req.body.templateName.toLowerCase();

            const templates = await user.getWorkoutTemplates();

            for (const template of templates) {
                if (template.name.toLowerCase() == name) {
                    workoutData.workout_template_id = template.id;
                    break;
                }
            }
        }
        
        const duration = req.body.duration;
        if (duration && duration >= 0 && duration <= 1000000) {
            workoutData.duration = Math.round(duration);
        }

        const date = new Date(req.body.date);
        if (date != 'Invalid Date') {
            workoutData.date = date;
        }

        const workout = await user.createWorkout(workoutData);

        const exercises = req.body.exercises;
        if (exercises) {

            // first map user exercises and global exercises
            const map = await mapExercises(user);

            // iterate through given exercises 
            let exercisePosition = 0;
            for (const exercise of exercises) {

                if (!exercise.name) {
                    continue;
                }
                const name = exercise.name.toLowerCase();

                // check if exercise exists
                if (!map.has(name)) {
                    continue;
                }
                
                const currExercise = map.get(name);

                const currWorkoutExercise = await WorkoutExercise.create({
                    workout_id: workout.id, 
                    exercise_id: currExercise.id, 
                    position: exercisePosition
                });
                exercisePosition++;

                if (!exercise.sets) {
                    continue;
                }

                const formatedSets = [];
                let setPosition = 0;
                for (const set of exercise.sets) {
                    if (!set.reps || !set.weight || set.reps <= 0 || set.weight < 0) {
                        continue;
                    }
                    formatedSets.push({
                        workout_exercise_id: currWorkoutExercise.id, 
                        reps: set.reps, 
                        weight: set.weight, 
                        position: setPosition 
                    });
                    setPosition++;
                }

                await Set.bulkCreate(formatedSets);
            }
        }

        return res.status(200).json({ message: 'Successfully added workout' });
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

        const workout = (await user.getWorkouts({ where: {id: workoutId } }))[0];

        if (!workout) {
            console.log('Workout does not exist');
            const err = new Error('Workout does not exist');
            err.status = 404;
            return next(err);
        }        

        const data = req.body;

        if (data.templateName) {
            const name = data.templateName.toLowerCase();

            const templates = await user.getWorkoutTemplates();

            for (const template of templates) {
                if (template.name.toLowerCase() == name) {
                    workout.workout_template_id = template.id;
                    break;
                }
            }
        }

        const duration = data.duration;
        if (duration && duration >= 0 && duration <= 1000000) {
            workout.duration = Math.round(duration);
        }

        const date = new Date(data.date);
        if (date != 'Invalid Date') {
            workout.date = date;
        }        

        const exercises = data.exercises;
        if (exercises) {

            // clear previous exercises
            await workout.setExercises([]);

            // first map user exercises and global exercises
            const map = await mapExercises(user);

            // iterate through given exercises 
            let exercisePosition = 0;
            for (const exercise of exercises) {

                if (!exercise.name) {
                    continue;
                }
                const name = exercise.name.toLowerCase();

                // check if exercise exists
                if (!map.has(name)) {
                    continue;
                }
                
                const currExercise = map.get(name);

                const currWorkoutExercise = await WorkoutExercise.create({
                    workout_id: workout.id, 
                    exercise_id: currExercise.id, 
                    position: exercisePosition
                });
                exercisePosition++;

                if (!exercise.sets) {
                    continue;
                }

                const formatedSets = [];
                let setPosition = 0;
                for (const set of exercise.sets) {
                    if (!set.reps || !set.weight || set.reps <= 0 || set.weight < 0) {
                        continue;
                    }
                    formatedSets.push({
                        workout_exercise_id: currWorkoutExercise.id, 
                        reps: set.reps, 
                        weight: set.weight, 
                        position: setPosition 
                    });
                    setPosition++;
                }

                await Set.bulkCreate(formatedSets);
            }
        }        

        await workout.save();

        return res.status(200).json({ message: 'Successfully edited workout' });
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