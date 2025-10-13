import { 
    validateUsername,
    validatePassword,
    validateEmail,
} from '../../../validations/userValidations.js';


describe('Username validation', () => {
    test('No username', () => {
        const username = null;
        const errors = [];
        validateUsername(username, errors);

        expect(errors).toContain('Missing username');
    });

    test('Username is not a string', () => {
        const username = 100;
        const errors = [];
        validateUsername(username, errors);

        expect(errors).toContain('Username needs to be a string');
    });

    test('Username shorter than 3 characters', () => {
        const username = 'us';
        const errors = [];
        validateUsername(username, errors);

        expect(errors).toContain('Username needs to be atleast 3 characters long');
    });

    test('Username too long', () => {
        let username = '';
        for (let i = 0; i < 256; i++) {
            username += 'a';
        }

        const errors = [];
        validateUsername(username, errors);

        expect(errors).toContain('Username too long, max length 255');
    });

    test('Valid username', () => {
        const username = 'valid username';
        const errors = [];
        validateUsername(username, errors);

        expect(errors).toEqual([]);
    });
});


describe('Password validation', () => {
    test('No password', () => {
        const password = null;
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Missing password');
    });

    test('Password is not a string', () => {
        const password = 10.20;
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Password needs to be a string');
    });

    test('Password too short', () => {
        const password = 'Pas1!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Password needs to be atleast 8 characters long');
    });

    test('Password too long', () => {
        let password = '';
        for (let i = 0; i < 256; i++) {
            password += 'a';
        }
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Password too long, max length 255');
    });

    test('Password without digit', () => {
        const password = 'Password!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Password must contain digit');
    });

    test('Password without special character', () => {
        const password = 'Password1';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Password must contain special character');
    });

    test('Password without lower case english character', () => {
        const password = 'PASSWORD1!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Password must contain lower case english letter');
    });

    test('Password without upper case english character', () => {
        const password = 'password1!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toContain('Password must contain upper case english letter');
    });

    test('Valid password', () => {
        const password = 'Password1!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual([]);
    });
});


describe('Email validation', () => {
    test('No email', () => {
        const email = null;
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Missing email');
    });

    test('Email is not a string', () => {
        const email = 100;
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email needs to be a string');
    });   

    test('Email too long', () => {
        let email = '';
        for (let i = 0; i < 256; i++) {
            email += 'a';
        }
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email too long, max length 255');
    });    
    
    test('Email without @ sign', () => {
        const email = 'examplegmail.com';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email must contain @ sign');
    });

    test('Email contains more than one @ sign', () => {
        const email = 'example@@gmail.com';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email cant contain more than one @ sign');
    });

    test('Email without local part', () => {
        const email = '@gmail.com';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email missing part before @ sign');
    });

    test('Email without first domain part', () => {
        const email = 'exmaple@.com';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email missing part after @ sign');
    });   
    
    test('Email without dot in domain', () => {
        const email = 'exmaple@gmail,com';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email missing . after @ sign');
    });    

    test('Email missing domain part after .', () => {
        const email = 'exmaple@gmail.';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toContain('Email missing domain after .');
    });    

    test('Valid email', () => {
        const email = 'email@gmail.com';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toEqual([]);
    });
});