export const validateMeasurement = (newMeasurement, measurementData, errors) => {

    // get newMeasurement fields in set
    const set = new Set(Object.keys(newMeasurement));

    for (const field in measurementData) {
        // check if user provided field is in new measurement fields
        if (set.has(field)) {
            newMeasurement[field] = measurementData[field];
        }
        else {
            console.log(`Ignoring field: ${field}`);
        }
    }

    // validate values
    for (const field in newMeasurement) {
        if (newMeasurement[field] == null) {
            continue;
        }
        
        if (field == 'date') {
            const date = new Date(newMeasurement.date);
            if (date == 'Invalid Date') {
                errors.push('Invalid date');
            }
            else {
                newMeasurement.date = date;
            }
            continue;
        }

        const value = newMeasurement[field];
        const decimalPart = (value.toString().split('.'))[1];

        if (isNaN(value) || value < 0 || value > 10000) {
            errors.push(`${field} needs to be a number between 0 and 10000`);
        } 
        else if (decimalPart && decimalPart.length > 2) {
            errors.push(`${field} needs to be a number with maximum 2 digits in decimal part`);
        }
    }
};