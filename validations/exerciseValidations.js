export const validateName = (newExercise, exerciseData, errors, exercisesNamesSet) => {
    const name = exerciseData.name;
    // check if there is name
    if (!name) {
        errors.push('Missing exercise name');
        return;
    }

    // check name length
    if (name.length == 0 || name.length >= 256) {
        errors.push('Exercise name must be between 1 or 255 characters long');
    }

    const lowerCaseName = name.toLowerCase();

    // check characters
    for (const char of lowerCaseName) {
        if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == ' ')) {
            errors.push('Exercise name can contain only english letters, digits, and spaces');
            break;
        }
    }

    // check if exercise with this name already exists
    if (exercisesNamesSet.has(lowerCaseName)) {
        errors.push('Exercise with this name already exists');
    }

    newExercise.name = name;
};

export const validateDescription = (newExercise, exerciseData, errors) => {
    const description = exerciseData.description;

    if (!description) {
        return;
    }

    if (description.length > 1000) {
        errors.push('Description cant be longer than 1000 characters');
    }

    newExercise.description = description;
};

export const validateMuscleGroups = (newExercise, exerciseData, errors, muscleGroupsIdsSet) => {
    const muscleGroups = exerciseData.muscleGroups;

    if (!muscleGroups) {
        return;
    }
    
    if (!Array.isArray(muscleGroups)) {
        errors.push('muscleGroups needs to be positive integer array');
        return;
    }

    for (const muscleGroup of muscleGroups) {
        if (isNaN(muscleGroup) || !Number.isInteger(muscleGroup) || muscleGroup < 0) {
            errors.push(`${muscleGroup} is invalid. Muscle group id needs to be positive integer.`);
            continue;
        }

        const currId = Number(muscleGroup);

        if (!muscleGroupsIdsSet.has(currId)) {
            errors.push(`Muscle group with id ${currId} does not exist`);
        }
    }

    newExercise.muscleGroups = muscleGroups;
};