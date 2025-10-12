export const validateTemplate = (templateId, errors, templatesIdsSet) => {

    if (templateId == null) {
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
};

export const validateDuration = (duration, errors) => {

    if (duration == null) {
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
};

export const validateDate = (date, errors) => {
    if (date == null) {
        errors.push('Missing workout date');
        return;
    }

    if (typeof date == 'number') {
        errors.push('Date must be a string or Date object');
        return;
    }

    const checkDate = new Date(date);
    if (Number.isNaN(checkDate.getTime())) {
        errors.push('Invalid workout date');
    }
};

export const validateWeight = (weight, errors) => {
    if (weight == null) {
        errors.push('Missing weight in set');
        return;
    }

    if (typeof weight != 'number' || isNaN(weight) || weight < 0 || weight > 100000) {
        errors.push('Weight needs to be number between 0 and 100000');
        return;
    }

    const decimalPart = (weight.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Weight needs to be a number with maximum 2 digits in decimal part');
    }    
};

export const validateReps = (reps, errors) => {
    if (reps == null) {
        errors.push('Missing reps in set');
        return;
    }

    if (typeof reps != 'number' || !Number.isInteger(reps) || reps < 1 || reps > 100000) {
        errors.push('Reps needs to be integer between 1 and 100000');
        return;
    }
};

export const validateSets = (sets, errors, limit) => {
    if (sets == null) {
        return;
    }

    if (!Array.isArray(sets)) {
        errors.push('sets must be an array');
        return;
    }

    if (sets.length > limit) {
        errors.push(`too much sets in exercise, limit is: ${limit}`);
        return;
    }

    for (const set of sets) {
        const reps = set.reps;
        const weight = set.weight;

        validateReps(reps, errors);
        validateWeight(weight, errors);

        if (errors.length > 0) {
            return;
        }
    }
};

export const validateExercises = (exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit) => {

    if (exercises == null) {
        return;
    }

    if (!Array.isArray(exercises)) {
        errors.push('exercises must be an array');
        return; 
    }

    if (exercises.length > exercisesLimit) {
        errors.push(`too much exercises, limit is: ${exercisesLimit}`);
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

        validateSets(exercise.sets, errors, setsLimit);

        if (errors.length > 0) {
            return;
        }
    }
};