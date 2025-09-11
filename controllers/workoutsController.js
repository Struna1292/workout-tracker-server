import Exercise from '../models/Exercise.js';
import WorkoutExercise from '../models/WorkoutExercise.js';
import Set from '../models/Set.js';

export const getUserWorkouts = async (req, res, next) => {

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

};

export const removeWorkout = async (req, res, next) => {

};