export const validateName = (name, errors, weekSchedulesNamesSet) => {
    if (name == null) {
        errors.push('Missing week schedule name');
        return;
    }

    if (typeof name != 'string') {
        errors.push('Week schedule name must be type string');
        return;
    }

    if (name.length == 0 || name.length >= 256) {
        errors.push('Week schedule name must be between 1 or 255 characters long');
    }

    const lowerCaseName = name.toLowerCase();

    let spaces = true;
    // check characters
    for (const char of lowerCaseName) {
        if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == ' ')) {
            errors.push('Week schedule name can contain only english letters, digits, and spaces');
            return;
        }

        if (char != ' ') {
            spaces = false;
        }
    }

    if (spaces) {
        errors.push('Week schedule name cannot consist only of spaces');
        return;
    }

    if (weekSchedulesNamesSet.has(lowerCaseName)) {
        errors.push('Week schedule with this name already exists');
    }    
};

export const validateSelected = (selected, errors) => {
    if (selected == null) {
        return;
    }

    if (typeof selected !== 'boolean') {
        errors.push('selected needs to be boolean type');
        return;
    }
};

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

export const validateDay = (day, errors) => {
    if (day == null) {
        errors.push('Missing day in scheduled workout');
        return;
    }

    if (typeof day !== 'string') {
        errors.push('Invalid type day in scheduled workout, must be a string');
        return;
    }

    const days = new Set(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

    if (!days.has(day.toLowerCase())) {
        errors.push('Day in scheduled workout must be one of the following: monday, tuesday, wednesday, thursday, friday, saturday, sunday.');
        return;
    }
};

export const validateTime = (time, errors) => {
    if (time == null) {
        return;
    }

    if (typeof time !== 'string') {
        errors.push('Time must be a string');
        return;
    }

    if (!time.includes(':')) {
        errors.push('Time must contain : between hours and minutes');
        return;
    }

    const [hours, minutes] = time.split(':');

    if (hours == null || hours == '') {
        errors.push('Time must contain hours');
        return;
    }

    if (minutes == null || minutes == '') {
        errors.push('Time must contain minutes');
        return;
    }

    const hoursNum = Number(hours);
    const minutesNum = Number(minutes);

    if (!Number.isInteger(hoursNum) || hoursNum < 0 || hoursNum > 23) {
        errors.push('Hours must be integer between 0 and 23');
        return;
    }

    if (!Number.isInteger(minutesNum) || minutesNum < 0 || minutesNum > 59) {
        errors.push('Minutes must be integer between 0 and 59');
        return;
    }
};

export const validateScheduledWorkouts = (scheduledWorkouts, errors, templatesIdsSet, limit) => {
    if (scheduledWorkouts == null) {
        errors.push('Missing scheduled workouts');
        return;
    }

    if (!Array.isArray(scheduledWorkouts)) {
        errors.push('scheduled workouts must be an array');
        return;
    }

    if (scheduledWorkouts.length > limit) {
        errors.push(`too much scheduled workouts, limit is: ${limit}`);
        return;
    }
    
    for (const scheduledWorkout of scheduledWorkouts) {
        if (typeof scheduledWorkout !== 'object') {
            errors.push('Scheduled workout must be type object');
            return;
        }

        validateTemplate(scheduledWorkout.templateId, errors, templatesIdsSet);

        validateDay(scheduledWorkout.day, errors);

        validateTime(scheduledWorkout.time, errors);

        if (errors.length > 0) {
            return;
        }
    }
};