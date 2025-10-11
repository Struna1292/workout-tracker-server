import { 
    validateName,
    validateExercises,
} from '../../validations/templateValidations.js';

describe('Validate template name', () => {
    test('Is null', () => {
        const name = null;
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Missing template name');
    });

    test('Not a string', () => {
        const name = 100;
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Template name must be type string');
    });
    
    test('Too short', () => {
        const name = '';
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Template name must be between 1 or 255 characters long');
    }); 

    test('Too long', () => {
        const name = 'a'.repeat(256);
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Template name must be between 1 or 255 characters long');
    });
    
    test('Invalid char', () => {
        const name = 'template!';
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Template name can contain only english letters, digits, and spaces');
    });
    
    test('Tempalte already exists', () => {
        const name = 'template';
        const templatesNamesSet = new Set(['template']);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Template with this name already exists');
    });

    test('Already exists case insensitive', () => {
        const name = 'tEmPLATE';
        const templatesNamesSet = new Set(['template']);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Template with this name already exists');
    });
    
    test('Only spaces', () => {
        const name = '            ';
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toContain('Template name cannot consist only of spaces');
    });    

    test('Valid template name with all allowed characters', () => {
        const name = 'Valid Template 123';
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toEqual([]);
    });

    test('Valid template name', () => {
        const name = 'valid name';
        const templatesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, templatesNamesSet);

        expect(errors).toEqual([]);
    });
});

describe('Validate template exercises', () => {
    test('Not an array', () => {
        const exercises = 123;
        const exercisesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toContain('exercises needs to be positive integer array');
    });

    test('Not integer array', () => {
        const exercises = ['abc'];
        const exercisesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toContain('abc is invalid. Exercise id needs to be positive integer.');
    });
    
    test('Negative integer', () => {
        const exercises = [-1];
        const exercisesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toContain('-1 is invalid. Exercise id needs to be positive integer.');
    });
    
    test('Id not found', () => {
        const exercises = [1, 2, 3];
        const exercisesIdsSet = new Set([1, 2]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toContain('Exercise with id 3 does not exist');
    });
    
    test('Id is float', () => {
        const exercises = [1, 2.5];
        const exercisesIdsSet = new Set([1, 2]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toContain('2.5 is invalid. Exercise id needs to be positive integer.');
    });
    
    test('Ids are string', () => {
        const exercises = ['12', '23'];
        const exercisesIdsSet = new Set([12, 23]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toContain('12 is invalid. Exercise id needs to be positive integer.');
    });

    test('Too much exercises', () => {
        const exercises = new Array(4).fill(1);
        const exercisesIdsSet = new Set([1]);
        const limit = 3;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toContain(`too much exercises, limit is: ${limit}`);
    });    
    
    test('Valid null', () => {
        const exercises = null;
        const exercisesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toEqual([]);
    });

    test('Valid empty array', () => {
        const exercises = [];
        const exercisesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toEqual([]);
    });

    test('Valid array', () => {
        const exercises = [6, 5, 4];
        const exercisesIdsSet = new Set([4, 5, 6]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toEqual([]);
    });

    test('Valid same exercise on different position', () => {
        const exercises = [1, 1, 1];
        const exercisesIdsSet = new Set([1]);
        const limit = 10;
        const errors = [];

        validateExercises(exercises, errors, exercisesIdsSet, limit);

        expect(errors).toEqual([]);
    });       
});