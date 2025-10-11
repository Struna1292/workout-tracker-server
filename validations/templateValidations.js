export const validateName = (name, errors, templatesNamesSet) => {
    // check if there is name
    if (name == null) {
        errors.push('Missing template name');
        return;
    }

    if (typeof name != 'string') {
        errors.push('Template name must be type string');
        return;
    }    

    // check name length
    if (name.length == 0 || name.length >= 256) {
        errors.push('Template name must be between 1 or 255 characters long');
    }

    const lowerCaseName = name.toLowerCase();

    let spaces = true;
    // check characters
    for (const char of lowerCaseName) {
        if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == ' ')) {
            errors.push('Template name can contain only english letters, digits, and spaces');
            return;
        }

        if (char != ' ') {
            spaces = false;
        }        
    }

    if (spaces) {
        errors.push('Template name cannot consist only of spaces');
        return;
    }    

    // check if template with this name already exists
    if (templatesNamesSet.has(lowerCaseName)) {
        errors.push('Template with this name already exists');
    }
};

export const validateExercises = (exercises, errors, exercisesIdsSet, limit) => {
    if (exercises == null) {
        return;
    }
    
    if (!Array.isArray(exercises)) {
        errors.push('exercises needs to be positive integer array');
        return;
    }

    if (exercises.length > limit) {
        errors.push(`too much exercises, limit is: ${limit}`);
        return;
    }    

    for (const exercise of exercises) {
        if (isNaN(exercise) || !Number.isInteger(exercise) || exercise < 0) {
            errors.push(`${exercise} is invalid. Exercise id needs to be positive integer.`);
            continue;
        }

        const currId = Number(exercise);

        if (!exercisesIdsSet.has(currId)) {
            errors.push(`Exercise with id ${currId} does not exist`);
        }
    }
};