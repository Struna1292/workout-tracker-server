export const validateName = (newTemplate, templateData, errors, templatesNamesSet) => {
    const name = templateData.name;
    // check if there is name
    if (!name) {
        errors.push('Missing template name');
        return;
    }

    // check name length
    if (name.length == 0 || name.length >= 256) {
        errors.push('Template name must be between 1 or 255 characters long');
    }

    const lowerCaseName = name.toLowerCase();

    // check characters
    for (const char of lowerCaseName) {
        if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == ' ')) {
            errors.push('Template name can contain only english letters, digits, and spaces');
            break;
        }
    }

    // check if template with this name already exists
    if (templatesNamesSet.has(lowerCaseName)) {
        errors.push('Template with this name already exists');
    }

    newTemplate.name = name;
};

export const validateExercises = (newTemplate, templateData, errors, exercisesIdsSet) => {
    const exercises = templateData.exercises;

    if (!exercises) {
        return;
    }
    
    if (!Array.isArray(exercises)) {
        errors.push('exercises needs to be positive integer array');
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

    newTemplate.exercises = exercises;
};