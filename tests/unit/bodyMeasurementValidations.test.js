import { 
    validateWeight,
    validateArm,
    validateForearm,
    validateChest,
    validateWaist,
    validateHips,
    validateThigh,
    validateCalf,
    validateDate,    
} from '../../validations/bodyMeasurementValidations.js';

describe('Validate weight', () => {
    test('Weight is NaN', () => {
        const weight = NaN;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be a number between 0 and 10000');
    });

    test('Weight not a number', () => {
        const weight = '12.34';
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be a number between 0 and 10000');
    });

    test('Weight is negative number', () => {
        const weight = -1;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be a number between 0 and 10000');
    });
    
    test('Weight too big', () => {
        const weight = 10001;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const weight = 1.111;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toContain('Weight needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid weight with decimal part', () => {
        const weight = 77.23;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toEqual([]);
    });

    test('Valid weight without decimal part', () => {
        const weight = 77;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max weight', () => {
        const weight = 10000;
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

    test('Valid null weight', () => {
        const weight = null;
        const errors = [];

        validateWeight(weight, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate arm', () => {
    test('Arm is NaN', () => {
        const arm = NaN;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toContain('Arm needs to be a number between 0 and 10000');
    });

    test('Arm not a number', () => {
        const arm = '12.34';
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toContain('Arm needs to be a number between 0 and 10000');
    });

    test('Arm is negative number', () => {
        const arm = -1;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toContain('Arm needs to be a number between 0 and 10000');
    });
    
    test('Arm too big', () => {
        const arm = 10001;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toContain('Arm needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const arm = 1.111;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toContain('Arm needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid arm with decimal part', () => {
        const arm = 77.23;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toEqual([]);
    });

    test('Valid arm without decimal part', () => {
        const arm = 77;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max arm', () => {
        const arm = 10000;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min arm', () => {
        const arm = 0;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null arm', () => {
        const arm = null;
        const errors = [];

        validateArm(arm, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate forearm', () => {
    test('Forearm is NaN', () => {
        const forearm = NaN;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toContain('Forearm needs to be a number between 0 and 10000');
    });

    test('Forearm not a number', () => {
        const forearm = '12.34';
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toContain('Forearm needs to be a number between 0 and 10000');
    });

    test('Forearm is negative number', () => {
        const forearm = -1;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toContain('Forearm needs to be a number between 0 and 10000');
    });
    
    test('Forearm too big', () => {
        const forearm = 10001;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toContain('Forearm needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const forearm = 1.111;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toContain('Forearm needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid forearm with decimal part', () => {
        const forearm = 77.23;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toEqual([]);
    });

    test('Valid forearm without decimal part', () => {
        const forearm = 77;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max forearm', () => {
        const forearm = 10000;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min forearm', () => {
        const forearm = 0;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null forearm', () => {
        const forearm = null;
        const errors = [];

        validateForearm(forearm, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate chest', () => {
    test('chest is NaN', () => {
        const chest = NaN;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toContain('Chest needs to be a number between 0 and 10000');
    });

    test('chest not a number', () => {
        const chest = '12.34';
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toContain('Chest needs to be a number between 0 and 10000');
    });

    test('chest is negative number', () => {
        const chest = -1;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toContain('Chest needs to be a number between 0 and 10000');
    });
    
    test('chest too big', () => {
        const chest = 10001;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toContain('Chest needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const chest = 1.111;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toContain('Chest needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid chest with decimal part', () => {
        const chest = 77.23;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toEqual([]);
    });

    test('Valid chest without decimal part', () => {
        const chest = 77;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max chest', () => {
        const chest = 10000;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min chest', () => {
        const chest = 0;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null chest', () => {
        const chest = null;
        const errors = [];

        validateChest(chest, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate waist', () => {
    test('waist is NaN', () => {
        const waist = NaN;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toContain('Waist needs to be a number between 0 and 10000');
    });

    test('waist not a number', () => {
        const waist = '12.34';
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toContain('Waist needs to be a number between 0 and 10000');
    });

    test('waist is negative number', () => {
        const waist = -1;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toContain('Waist needs to be a number between 0 and 10000');
    });
    
    test('waist too big', () => {
        const waist = 10001;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toContain('Waist needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const waist = 1.111;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toContain('Waist needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid waist with decimal part', () => {
        const waist = 77.23;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toEqual([]);
    });

    test('Valid waist without decimal part', () => {
        const waist = 77;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max waist', () => {
        const waist = 10000;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min waist', () => {
        const waist = 0;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null waist', () => {
        const waist = null;
        const errors = [];

        validateWaist(waist, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate hips', () => {
    test('hips is NaN', () => {
        const hips = NaN;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toContain('Hips needs to be a number between 0 and 10000');
    });

    test('hips not a number', () => {
        const hips = '12.34';
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toContain('Hips needs to be a number between 0 and 10000');
    });

    test('hips is negative number', () => {
        const hips = -1;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toContain('Hips needs to be a number between 0 and 10000');
    });
    
    test('hips too big', () => {
        const hips = 10001;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toContain('Hips needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const hips = 1.111;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toContain('Hips needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid hips with decimal part', () => {
        const hips = 77.23;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toEqual([]);
    });

    test('Valid hips without decimal part', () => {
        const hips = 77;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max hips', () => {
        const hips = 10000;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min hips', () => {
        const hips = 0;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null hips', () => {
        const hips = null;
        const errors = [];

        validateHips(hips, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate thigh', () => {
    test('thigh is NaN', () => {
        const thigh = NaN;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toContain('Thigh needs to be a number between 0 and 10000');
    });

    test('thigh not a number', () => {
        const thigh = '12.34';
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toContain('Thigh needs to be a number between 0 and 10000');
    });

    test('thigh is negative number', () => {
        const thigh = -1;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toContain('Thigh needs to be a number between 0 and 10000');
    });
    
    test('thigh too big', () => {
        const thigh = 10001;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toContain('Thigh needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const thigh = 1.111;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toContain('Thigh needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid thigh with decimal part', () => {
        const thigh = 77.23;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toEqual([]);
    });

    test('Valid thigh without decimal part', () => {
        const thigh = 77;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max thigh', () => {
        const thigh = 10000;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min thigh', () => {
        const thigh = 0;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null thigh', () => {
        const thigh = null;
        const errors = [];

        validateThigh(thigh, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate calf', () => {
    test('calf is NaN', () => {
        const calf = NaN;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toContain('Calf needs to be a number between 0 and 10000');
    });

    test('calf not a number', () => {
        const calf = '12.34';
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toContain('Calf needs to be a number between 0 and 10000');
    });

    test('calf is negative number', () => {
        const calf = -1;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toContain('Calf needs to be a number between 0 and 10000');
    });
    
    test('calf too big', () => {
        const calf = 10001;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toContain('Calf needs to be a number between 0 and 10000');
    });

    test('Too much digits in decimal part', () => {
        const calf = 1.111;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toContain('Calf needs to be a number with maximum 2 digits in decimal part');
    });

    test('Valid calf with decimal part', () => {
        const calf = 77.23;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toEqual([]);
    });

    test('Valid calf without decimal part', () => {
        const calf = 77;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toEqual([]);
    });

    test('Valid max calf', () => {
        const calf = 10000;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toEqual([]);
    });

    test('Valid min calf', () => {
        const calf = 0;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toEqual([]);
    });    

    test('Valid null calf', () => {
        const calf = null;
        const errors = [];

        validateCalf(calf, errors);

        expect(errors).toEqual([]);
    });
});

describe('Validate date', () => {
    test('Missing date', () => {
        const date = null;
        const errors = [];

        validateDate(date, errors);

        expect(errors).toContain('Missing date');
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

        expect(errors).toContain('Invalid date');
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