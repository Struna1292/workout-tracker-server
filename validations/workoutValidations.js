const EXERCISES_IN_WORKOUT_LIMIT = process.env.EXERCISES_IN_WORKOUT_LIMIT || 50;
const SETS_IN_EXERCISE_LIMIT = process.env.SETS_IN_EXERCISE_LIMIT || 30;

export const validateTemplate = (newWorkout, workoutData, errors, templatesIdsSet) => {
    const templateId = workoutData.template;

    if (!templateId) {
        return;
    }

    if (!Number.isInteger(templateId)) {
        errors.push('template needs to be integer id');
        return;
    }

    const id = Number(templateId);

    if (!templatesIdsSet.has(id)) {
        errors.push(`Template with id ${id} does not exist`);
        return;
    }

    newWorkout.workout_template_id = id;
};

export const validateDuration = (newWorkout, workoutData, errors) => {
    const duration = workoutData.duration;

    if (!duration) {
        return;
    }

    if (!Number.isInteger(duration)) {
        errors.push('Duration needs to be positive integer');
        return;
    }

    if (duration < 0 || duration > 100000) {
        errors.push('Duration needs to be integer between 0 and 100000');
        return;
    }

    newWorkout.duration = duration;
};

export const validateDate = (newWorkout, workoutData, errors) => {
    if (!workoutData.date) {
        errors.push('Missing date');
        return;
    }

    const date = new Date(workoutData.date);
    if (date == 'Invalid Date') {
        errors.push('Invalid date');
        return;
    }

    newWorkout.date = date;
};

export const validateExercises = (newWorkout, workoutData, errors, exercisesIdsSet) => {
    const exercises = workoutData.exercises;

    if (!exercises) {
        return;
    }

    if (!Array.isArray(exercises)) {
        errors.push('exercises must be an array');
        return; 
    }

    if (exercises.length > EXERCISES_IN_WORKOUT_LIMIT) {
        errors.push(`too much exercises, limit is: ${EXERCISES_IN_WORKOUT_LIMIT}`);
        return;
    }

    for (const exercise of exercises) {
        const id = exercise.id;

        if (!Number.isInteger(id) || id < 0) {
            errors.push(`${id} is not positive integer exercise index`);
            return;
        }

        if (!exercisesIdsSet.has(Number(id))) {
            errors.push(`exercise with id ${id} not found`);
            return;
        }

        const sets = exercise.sets;
        if (!sets) {
            continue;
        }

        if (!Array.isArray(sets)) {
            errors.push('sets must be an array');
            return;
        }

        if (sets.length > SETS_IN_EXERCISE_LIMIT) {
            errors.push(`too much sets in exercise, limit is: ${SETS_IN_EXERCISE_LIMIT}`);
            return;
        }

        for (const set of sets) {
            const reps = set.reps;
            const weight = set.weight;

            if (!reps) {
                errors.push('Missing reps in set');
                return;
            }

            if (!Number.isInteger(reps) || reps < 1 || reps > 100000) {
                errors.push('Reps needs to be integer between 1 and 100000');
                return;
            }

            if (!weight) {
                errors.push('Missing weight in set');
                return;
            }

            if (isNaN(weight) || weight < 0 || weight > 100000) {
                errors.push('Weight needs to be number between 0 and 100000');
                return;
            }
        }
    }

    newWorkout.exercises = exercises;
};