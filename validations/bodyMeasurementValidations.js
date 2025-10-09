export const validateWeight = (weight, errors) => {
    if (weight == null) {
        return;
    }

    if (typeof weight != 'number' || Number.isNaN(weight) || weight < 0 || weight > 10000) {
        errors.push('Weight needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (weight.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Weight needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateArm = (arm, errors) => {
    if (arm == null) {
        return;
    }

    if (typeof arm != 'number' || Number.isNaN(arm) || arm < 0 || arm > 10000) {
        errors.push('Arm needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (arm.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Arm needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateForearm = (forearm, errors) => {
    if (forearm == null) {
        return;
    }

    if (typeof forearm != 'number' || Number.isNaN(forearm) || forearm < 0 || forearm > 10000) {
        errors.push('Forearm needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (forearm.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Forearm needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateChest = (chest, errors) => {
    if (chest == null) {
        return;
    }

    if (typeof chest != 'number' || Number.isNaN(chest) || chest < 0 || chest > 10000) {
        errors.push('Chest needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (chest.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Chest needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateWaist = (waist, errors) => {
    if (waist == null) {
        return;
    }

    if (typeof waist != 'number' || Number.isNaN(waist) || waist < 0 || waist > 10000) {
        errors.push('Waist needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (waist.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Waist needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateHips = (hips, errors) => {
    if (hips == null) {
        return;
    }

    if (typeof hips != 'number' || Number.isNaN(hips) || hips < 0 || hips > 10000) {
        errors.push('Hips needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (hips.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Hips needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateThigh = (thigh, errors) => {
    if (thigh == null) {
        return;
    }

    if (typeof thigh != 'number' || Number.isNaN(thigh) || thigh < 0 || thigh > 10000) {
        errors.push('Thigh needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (thigh.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Thigh needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateCalf = (calf, errors) => {
    if (calf == null) {
        return;
    }

    if (typeof calf != 'number' || Number.isNaN(calf) || calf < 0 || calf > 10000) {
        errors.push('Calf needs to be a number between 0 and 10000');
        return;
    }

    const decimalPart = (calf.toString().split('.'))[1];

    if (decimalPart && decimalPart.length > 2) {
        errors.push('Calf needs to be a number with maximum 2 digits in decimal part');
    }
}

export const validateDate = (date, errors) => {
    if (date == null) {
        errors.push('Missing date');
        return;
    }

    if (typeof date == 'number') {
        errors.push('Date must be a string or Date object');
        return;
    }

    const checkDate = new Date(date);
    if (Number.isNaN(checkDate.getTime())) {
        errors.push('Invalid date');
    }
}