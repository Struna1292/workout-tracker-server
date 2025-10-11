import { 
    validateName,
    validateDescription,
    validateMuscleGroups,
} from '../../validations/exerciseValidations.js';

describe('Validate exercise name', () => {
    test('Is null', () => {
        const name = null;
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Missing exercise name');
    });

    test('Not a string', () => {
        const name = 100;
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Exercise name must be type string');
    });
    
    test('Too short', () => {
        const name = '';
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Exercise name must be between 1 or 255 characters long');
    }); 

    test('Too long', () => {
        const name = 'a'.repeat(256);
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Exercise name must be between 1 or 255 characters long');
    });
    
    test('Invalid char', () => {
        const name = 'exercise!';
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Exercise name can contain only english letters, digits, and spaces');
    });
    
    test('Exercise already exists', () => {
        const name = 'exercise';
        const exercisesNamesSet = new Set(['exercise']);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Exercise with this name already exists');
    });

    test('Already exists case insensitive', () => {
        const name = 'eXeRcIsE';
        const exercisesNamesSet = new Set(['exercise']);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Exercise with this name already exists');
    });
    
    test('Only spaces', () => {
        const name = '            ';
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toContain('Exercise name cannot consist only of spaces');
    });    

    test('Valid exercise name with all allowed characters', () => {
        const name = 'Valid Exercise 123';
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toEqual([]);
    });

    test('Valid exercise name', () => {
        const name = 'valid name';
        const exercisesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, exercisesNamesSet);

        expect(errors).toEqual([]);
    });
});

describe('Validate exercise description', () => {
    test('Not a string', () => {
        const description = 123;
        const errors = [];

        validateDescription(description, errors);

        expect(errors).toContain('Description must be type string');
    });

    test('Too long', () => {
        const description = 'a'.repeat(1001);
        const errors = [];

        validateDescription(description, errors);

        expect(errors).toContain('Description cant be longer than 1000 characters');
    });    

    test('Valid null description', () => {
        const description = null;
        const errors = [];

        validateDescription(description, errors);

        expect(errors).toEqual([]);
    });

    test('Valid description', () => {
        const description = 'Valid Exercise 1! Description';
        const errors = [];

        validateDescription(description, errors);

        expect(errors).toEqual([]);
    });    
});

describe('Validate exercise muscle groups', () => {
    test('Not an array', () => {
        const muscleGroups = 123;
        const muscleGroupsIdsSet = new Set([]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toContain('muscleGroups needs to be positive integer array');
    });

    test('Not integer array', () => {
        const muscleGroups = ['abc'];
        const muscleGroupsIdsSet = new Set([]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toContain('abc is invalid. Muscle group id needs to be positive integer.');
    });
    
    test('Negative integer', () => {
        const muscleGroups = [-1];
        const muscleGroupsIdsSet = new Set([]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toContain('-1 is invalid. Muscle group id needs to be positive integer.');
    });
    
    test('Id not found', () => {
        const muscleGroups = [1, 2, 3];
        const muscleGroupsIdsSet = new Set([1, 2]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toContain('Muscle group with id 3 does not exist');
    });
    
    test('Id is float', () => {
        const muscleGroups = [1, 2.5];
        const muscleGroupsIdsSet = new Set([1, 2]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toContain('2.5 is invalid. Muscle group id needs to be positive integer.');
    });
    
    test('Ids are string', () => {
        const muscleGroups = ['12', '23'];
        const muscleGroupsIdsSet = new Set([12, 23]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toContain('12 is invalid. Muscle group id needs to be positive integer.');
    });
    
    test('Multiple occurrences of id', () => {
        const muscleGroups = [1, 1, 1];
        const muscleGroupsIdsSet = new Set([1]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toContain('Muscle group id cant reoccur in same exercise');
    });

    test('Valid null', () => {
        const muscleGroups = null;
        const muscleGroupsIdsSet = new Set([]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toEqual([]);
    });

    test('Valid empty array', () => {
        const muscleGroups = [];
        const muscleGroupsIdsSet = new Set([]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toEqual([]);
    });

    test('Valid array', () => {
        const muscleGroups = [6, 5, 4];
        const muscleGroupsIdsSet = new Set([4, 5, 6]);
        const errors = [];

        validateMuscleGroups(muscleGroups, errors, muscleGroupsIdsSet);

        expect(errors).toEqual([]);
    });
});