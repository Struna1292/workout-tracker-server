export const validateName = (name, errors, exercisesNamesSet) => {
    // check if there is name
    if (name == null) {
        errors.push('Missing exercise name');
        return;
    }

    if (typeof name != 'string') {
        errors.push('Exercise name must be type string');
        return;
    }

    // check name length
    if (name.length == 0 || name.length >= 256) {
        errors.push('Exercise name must be between 1 or 255 characters long');
    }

    const lowerCaseName = name.toLowerCase();

    let spaces = true;
    // check characters
    for (const char of lowerCaseName) {
        if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == ' ')) {
            errors.push('Exercise name can contain only english letters, digits, and spaces');
            return;
        }

        if (char != ' ') {
            spaces = false;
        }
    }

    if (spaces) {
        errors.push('Exercise name cannot consist only of spaces');
        return;
    }

    // check if exercise with this name already exists
    if (exercisesNamesSet.has(lowerCaseName)) {
        errors.push('Exercise with this name already exists');
    }    
};

export const validateDescription = (description, errors) => {
    if (description == null) {
        return;
    }

    if (typeof description != 'string') {
        errors.push('Description must be type string');
        return;
    }

    if (description.length > 1000) {
        errors.push('Description cant be longer than 1000 characters');
    }
};

export const validateMuscleGroups = (muscleGroups, errors, muscleGroupsIdsSet) => {
    if (muscleGroups == null) {
        return;
    }
    
    if (!Array.isArray(muscleGroups)) {
        errors.push('muscleGroups needs to be positive integer array');
        return;
    }

    // store given ids in set to check if they reoccur
    const set = new Set();

    for (const muscleGroup of muscleGroups) {
        if (isNaN(muscleGroup) || !Number.isInteger(muscleGroup) || muscleGroup < 0) {
            errors.push(`${muscleGroup} is invalid. Muscle group id needs to be positive integer.`);
            continue;
        }

        const currId = Number(muscleGroup);

        if (!muscleGroupsIdsSet.has(currId)) {
            errors.push(`Muscle group with id ${currId} does not exist`);
        }

        if (set.has(currId)) {
            errors.push('Muscle group id cant reoccur in same exercise');
            return;
        }

        set.add(currId);
    }
};