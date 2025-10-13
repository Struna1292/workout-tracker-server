import { 
    validateTemplate,
    validateDuration,
    validateDate,
    validateWeight,
    validateReps,
    validateSets,
    validateExercises,
} from '../../validations/workoutValidations.js';

describe('Validate workout template', () => {
    test('invalid type', () => {
        const templateId = 'abc';
        const templatesIdsSet = new Set([1, 2]);
        const errors = [];

        validateTemplate(templateId, errors, templatesIdsSet);

        expect(errors).toContain('template needs to be integer id');
    });

    test('valid id in invalid type', () => {
        const templateId = '1';
        const templatesIdsSet = new Set([1, 2]);
        const errors = [];

        validateTemplate(templateId, errors, templatesIdsSet);

        expect(errors).toContain('template needs to be integer id');
    });    

    test('template with given id does not exist', () => {
        const templateId = 5;
        const templatesIdsSet = new Set([1, 2]);
        const errors = [];

        validateTemplate(templateId, errors, templatesIdsSet);

        expect(errors).toContain(`Template with id ${templateId} does not exist`);
    });    

    test('Valid existing template id', () => {
        const templateId = 2;
        const templatesIdsSet = new Set([1, 2, 3]);
        const errors = [];

        validateTemplate(templateId, errors, templatesIdsSet);

        expect(errors).toEqual([]);
    });

    test('Valid null template id', () => {
        const templateId = null;
        const templatesIdsSet = new Set([]);
        const errors = [];

        validateTemplate(templateId, errors, templatesIdsSet);

        expect(errors).toEqual([]);
    });
});

describe('Validate workout duration', () => {
    test('invalid type string', () => {
        const duration = '10';
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toContain('Duration needs to be positive integer');
    });

    test('invalid float', () => {
        const duration = 2.5;
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toContain('Duration needs to be positive integer');
    });

    test('negative number', () => {
        const duration = -10;
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toContain('Duration needs to be integer between 0 and 100000');
    });
    
    test('too big', () => {
        const duration = 100001;
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toContain('Duration needs to be integer between 0 and 100000');
    });

    test('Valid null duration', () => {
        const duration = null;
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toEqual([]);
    });

    test('Valid duration', () => {
        const duration = 125;
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toEqual([]);
    });
    
    test('Valid min duration', () => {
        const duration = 0;
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toEqual([]);
    }); 

    test('Valid max duration', () => {
        const duration = 100000;
        const errors = [];

        validateDuration(duration, errors);

        expect(errors).toEqual([]);
    });     
});

describe('Validate workout date', () => {
    test('Missing date', () => {
        const date = null;
        const errors = [];

        validateDate(date, errors);

        expect(errors).toContain('Missing workout date');
    }); 
    
    test('Date is a number', () => {
        const date = 123;
        const errors = [];

        validateDate(date, errors);

        expect(errors).toContain('Date must be a string or Date object');
    });

    test('Invalid date string', () => {
        const date = 'asdhgds';
        const errors = [];

        validateDate(date, errors);

        expect(errors).toContain('Invalid workout date');
    });

    test('Invalid date object', () => {
        const date = new Date('invalid date');
        const errors = [];

        validateDate(date, errors);

        expect(errors).toContain('Invalid workout date');
    });

    test('Valid date object', () => {
        const date = new Date();
        const errors = [];

        validateDate(date, errors);

        expect(errors).toEqual([]);
    });

    test('Valid date string', () => {
        const date = '2025-05-05';
        const errors = [];

        validateDate(date, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate set weight', () => {
    test('no weight', () => {
        const weight = null;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Missing weight in set');
    });

    test('not a number', () => {
        const weight = 'abcd';
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be number between 0 and 100000');
    });

    test('number in a string', () => {
        const weight = '20';
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be number between 0 and 100000');
    });
    
    test('too big', () => {
        const weight = 100001;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be number between 0 and 100000');
    });
    
    test('negative number', () => {
        const weight = -1;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be number between 0 and 100000');
    });    
    
    test('too much digits in decimal part', () => {
        const weight = 123.45678;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid weight with 2 digits in decimal part', () => {
        const weight = 10.55;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid weight', () => {
        const weight = 10;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min weight', () => {
        const weight = 0;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max weight', () => {
        const weight = 100000;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toEqual([]);
    });    
});

describe('Validate set reps', () => {
    test('no reps', () => {
        const reps = null;
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toContain('Missing reps in set');
    });

    test('invalid type', () => {
        const reps = '10';
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toContain('Reps needs to be integer between 1 and 100000');
    });

    test('float', () => {
        const reps = 22.33;
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toContain('Reps needs to be integer between 1 and 100000');
    });
    
    test('too much', () => {
        const reps = 100001;
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toContain('Reps needs to be integer between 1 and 100000');
    });

    test('too low', () => {
        const reps = 0;
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toContain('Reps needs to be integer between 1 and 100000');
    });

    test('Valid reps', () => {
        const reps = 10;
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toEqual([]);
    });
    
    test('Valid min reps', () => {
        const reps = 1;
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toEqual([]);
    });
    
    test('Valid max reps', () => {
        const reps = 100000;
        const errors = [];

        validateReps(reps, errors);

        expect(errors).toEqual([]);
    });    
});

describe('Validate sets', () => {
    test('Not an array', () => {
        const sets = 15;
        const limit = 2;
        const errors = [];

        validateSets(sets, errors, limit);

        expect(errors).toContain('sets must be an array');
    });

    test('Invalid type', () => {
        const sets = [1, 2, 3];
        const limit = 10;
        const errors = [];

        validateSets(sets, errors, limit);

        expect(errors).toContain('sets must be an object array');
    });

    test('too much sets', () => {
        const sets = [
            { weight: 10, reps: 10 },
            { weight: 20, reps: 20 },
            { weight: 20, reps: 20 },
        ];
        const limit = 2;
        const errors = [];

        validateSets(sets, errors, limit);

        expect(errors).toContain(`too much sets in exercise, limit is: ${limit}`);
    });

    test('Valid null sets', () => {
        const sets = null;
        const limit = 10;
        const errors = [];

        validateSets(sets, errors, limit);

        expect(errors).toEqual([]);
    });

    test('Valid empty array', () => {
        const sets = [];
        const limit = 10;
        const errors = [];

        validateSets(sets, errors, limit);

        expect(errors).toEqual([]);
    });    

    test('Valid sets', () => {
        const sets = [
            { weight: 10, reps: 10 },
            { weight: 20, reps: 20 },
        ];
        const limit = 10;
        const errors = [];

        validateSets(sets, errors, limit);

        expect(errors).toEqual([]);
    });

    test('Valid max sets', () => {
        const sets = [
            { weight: 10, reps: 10 },
            { weight: 20, reps: 20 },
        ];
        const limit = 2;
        const errors = [];

        validateSets(sets, errors, limit);

        expect(errors).toEqual([]);
    });    
});

describe('Validate workout exercises', () => {
    test('exercises not an array', () => {
        const exercises = 'abcd';
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 10;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toContain('exercises must be an array');
    });

    test('exercise id is not integer', () => {
        const exercises = [
            { id: '1' },
            { id: 1 },
            { id: 2 },
        ];
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 10;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toContain('1 is not integer greater than 0');
    });
    
    test('too much exercises', () => {
        const exercises = [
            { id: 1 },
            { id: 1 },
            { id: 2 },
        ];
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 2;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toContain(`too much exercises, limit is: ${exercisesLimit}`);
    });    

    test('exercise does not exist', () => {
        const exercises = [
            { id: 1 },
            { id: 1 },
            { id: 5 },
        ];
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 10;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toContain('exercise with id 5 not found');
    });

    test('exercise object without id', () => {
        const exercises = [
            { notId: 1 },
            { id: 1 },
            { id: 5 },
        ];
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 10;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toContain('Missing id in exercise object');
    });    

    test('Valid empty array', () => {
        const exercises = [];
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 10;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toEqual([]);
    });

    test('Valid null exercises', () => {
        const exercises = null;
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 10;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toEqual([]);
    });

    test('Valid exercises', () => {
        const exercises = [
            { id: 1 },
            { id: 1 },
            { id: 2 },
        ];
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 10;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toEqual([]);
    });

    test('Valid max exercises', () => {
        const exercises = [
            { id: 1 },
            { id: 1 },
            { id: 2 },
        ];
        const exercisesIdsSet = new Set([1, 2, 3]);
        const exercisesLimit = 3;
        const setsLimit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, exercisesLimit, setsLimit);

        expect(errors).toEqual([]);
    });    
});