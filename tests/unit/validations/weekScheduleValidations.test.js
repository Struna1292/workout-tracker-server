import {
    validateName,
    validateSelected,
    validateScheduledWorkouts,
    validateTemplate,
    validateDay,
    validateTime,
} from '../../../validations/weekScheduleValidations.js';

describe('Validate week schedule name', () => {
    test('Is null', () => {
        const name = null;
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Missing week schedule name');
    });

    test('Not a string', () => {
        const name = 100;
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Week schedule name must be type string');
    });
    
    test('Too short', () => {
        const name = '';
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Week schedule name must be between 1 or 255 characters long');
    }); 

    test('Too long', () => {
        const name = 'a'.repeat(256);
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Week schedule name must be between 1 or 255 characters long');
    });
    
    test('Invalid char', () => {
        const name = 'schedule!';
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Week schedule name can contain only english letters, digits, and spaces');
    });
    
    test('Week schedule already exists', () => {
        const name = 'schedule';
        const weekSchedulesNamesSet = new Set(['schedule']);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Week schedule with this name already exists');
    });

    test('Already exists case insensitive', () => {
        const name = 'sChEdUlE';
        const weekSchedulesNamesSet = new Set(['schedule']);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Week schedule with this name already exists');
    });
    
    test('Only spaces', () => {
        const name = '            ';
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toContain('Week schedule name cannot consist only of spaces');
    });    

    test('Valid Week schedule name with all allowed characters', () => {
        const name = 'Valid Schedule 123';
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toEqual([]);
    });

    test('Valid week schedule name', () => {
        const name = 'valid name';
        const weekSchedulesNamesSet = new Set([]);
        const errors = [];

        validateName(name, errors, weekSchedulesNamesSet);

        expect(errors).toEqual([]);
    });
});

describe('Validate week schedule selected', () => {
    test('invalid type number', () => {
        const selected = 100;
        const errors = [];

        validateSelected(selected, errors);

        expect(errors).toContain('selected needs to be boolean type');
    });

    test('invalid type string', () => {
        const selected = 'true';
        const errors = [];

        validateSelected(selected, errors);

        expect(errors).toContain('selected needs to be boolean type');
    });

    test('Valid true boolean', () => {
        const selected = true;
        const errors = [];

        validateSelected(selected, errors);

        expect(errors).toEqual([]);
    });

    test('Valid false boolean', () => {
        const selected = false;
        const errors = [];

        validateSelected(selected, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null', () => {
        const selected = null;
        const errors = [];

        validateSelected(selected, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate template id', () => {
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

describe('Validate day', () => {
    test('day is null', () => {
        const day = null;
        const errors = [];

        validateDay(day, errors);

        expect(errors).toContain('Missing day in scheduled workout');
    });

    test('not a string', () => {
        const day = 100;
        const errors = [];

        validateDay(day, errors);

        expect(errors).toContain('Invalid type day in scheduled workout, must be a string');
    });
    
    test('invalid day name', () => {
        const day = 'adsad';
        const errors = [];

        validateDay(day, errors);

        expect(errors).toContain('Day in scheduled workout must be one of the following: monday, tuesday, wednesday, thursday, friday, saturday, sunday.');
    });
    
    test('valid day', () => {
        const day = 'monday';
        const errors = [];

        validateDay(day, errors);

        expect(errors).toEqual([]);
    });
    
    test('valid day case insensitive', () => {
        const day = 'SuNDaY';
        const errors = [];

        validateDay(day, errors);

        expect(errors).toEqual([]);
    });    
});

describe('Validate time', () => {    
    test('Not a string', () => {
        const time = 123;
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Time must be a string');
    });

    test('Invalid string', () => {
        const time = 'asdhgds';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Time must contain : between hours and minutes');
    });    

    test('Missing : sign', () => {
        const time = '11 11';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Time must contain : between hours and minutes');
    });

    test('Missing hours', () => {
        const time = ':11';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Time must contain hours');
    });
    
    test('Missing minutes', () => {
        const time = '11:';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Time must contain minutes');
    });
    
    test('Invalid hours type', () => {
        const time = 'invalid:11';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Hours must be integer between 0 and 23');
    });
    
    test('Invalid minutes type', () => {
        const time = '11:invalid';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Minutes must be integer between 0 and 59');
    });
    
    test('hours negative integer', () => {
        const time = '-1:11';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Hours must be integer between 0 and 23');
    });
    
    test('hours too big', () => {
        const time = '24:00';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Hours must be integer between 0 and 23');
    });
    
    test('minutes negative integer', () => {
        const time = '11:-1';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Minutes must be integer between 0 and 59');
    });
    
    test('minutes too big', () => {
        const time = '11:60';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toContain('Minutes must be integer between 0 and 59');
    });    

    test('Valid time string', () => {
        const time = '11:11';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min time', () => {
        const time = '00:00';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toEqual([]);
    });
    
    test('Valid max time', () => {
        const time = '23:59';
        const errors = [];

        validateTime(time, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid missing time', () => {
        const time = null;
        const errors = [];

        validateTime(time, errors);

        expect(errors).toEqual([]);
    });     
});

describe('Validate scheduled workouts', () => {
    test('scheduled workouts null', () => {
        const scheduledWorkouts = null;
        const templatesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateScheduledWorkouts(scheduledWorkouts, errors, templatesIdsSet, limit);

        expect(errors).toContain('Missing scheduled workouts');
    });

    test('not an array', () => {
        const scheduledWorkouts = 100;
        const templatesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateScheduledWorkouts(scheduledWorkouts, errors, templatesIdsSet, limit);

        expect(errors).toContain('scheduled workouts must be an array');
    });
    
    test('invalid array elements type', () => {
        const scheduledWorkouts = [1, 2, 3];
        const templatesIdsSet = new Set([]);
        const limit = 10;
        const errors = [];

        validateScheduledWorkouts(scheduledWorkouts, errors, templatesIdsSet, limit);

        expect(errors).toContain('Scheduled workout must be type object');
    });    

    test('too much', () => {
        const scheduledWorkouts = [
            {
                templateId: 1,
                day: 'monday',
                time: '12:00',
            },
            {
                templateId: 2,
                day: 'SuNday',
                time: '23:44',
            },
        ];
        const templatesIdsSet = new Set([1, 2]);
        const limit = 1;        
        const errors = [];

        validateScheduledWorkouts(scheduledWorkouts, errors, templatesIdsSet, limit);

        expect(errors).toContain(`too much scheduled workouts, limit is: ${limit}`);
    });

    test('valid empty scheduled workouts', () => {
        const scheduledWorkouts = [];
        const templatesIdsSet = new Set([]);
        const limit = 10;        
        const errors = [];

        validateScheduledWorkouts(scheduledWorkouts, errors, templatesIdsSet, limit);

        expect(errors).toEqual([]);
    });

    test('valid scheduled workouts with valid objects', () => {
        const scheduledWorkouts = [
            {
                templateId: 1,
                day: 'monday',
                time: '12:00',
            },
            {
                templateId: 2,
                day: 'SuNday',
                time: '23:44',
            },
        ];
        const templatesIdsSet = new Set([1, 2]);
        const limit = 10;        
        const errors = [];

        validateScheduledWorkouts(scheduledWorkouts, errors, templatesIdsSet, limit);

        expect(errors).toEqual([]);
    });    
});