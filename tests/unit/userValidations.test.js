import { 
    validateUsername,
    validatePassword,
    validateEmail,
} from '../../validations/userValidations.js';


describe('Username validation', () => {
    test('No username', () => {
        const username = null;
        const errors = [];
        validateUsername(username, errors);

        expect(errors).toEqual(['Missing username']);
    });

    test('Username is not a string', () => {
        const username = 100;
        const errors = [];
        validateUsername(username, errors);

        expect(errors).toEqual(['Username needs to be a string']);
    });

    test('Username shorter than 3 characters', () => {
        const username = 'us';
        const errors = [];
        validateUsername(username, errors);

        expect(errors).toEqual(['Username needs to be atleast 3 characters long']);
    });

    test('Username too long', () => {
        let username = '';
        for (let i = 0; i < 256; i++) {
            username += 'a';
        }

        const errors = [];
        validateUsername(username, errors);

        expect(errors).toEqual(['Username too long, max length 255']);
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

        expect(errors).toEqual(['Missing password']);
    });

    test('Password is not a string', () => {
        const password = 10.20;
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual(['Password needs to be a string']);
    });

    test('Password too short', () => {
        const password = 'Pas1!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual(['Password needs to be atleast 8 characters long']);
    });

    test('Password too long', () => {
        let password = '';
        for (let i = 0; i < 256; i++) {
            password += 'a';
        }
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual(['Password too long, max length 255']);
    });

    test('Password without digit', () => {
        const password = 'Password!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual(['Password must contain digit']);
    });

    test('Password without special character', () => {
        const password = 'Password1';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual(['Password must contain special character']);
    });

    test('Password without lower case english character', () => {
        const password = 'PASSWORD1!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual(['Password must contain lower case english letter']);
    });

    test('Password without upper case english character', () => {
        const password = 'password1!';
        const errors = [];
        validatePassword(password, errors);

        expect(errors).toEqual(['Password must contain upper case english letter']);
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

        expect(errors).toEqual(['Missing email']);
    });

    test('Valid email', () => {
        const email = 'email@gmail.com';
        const errors = [];
        validateEmail(email, errors);

        expect(errors).toEqual([]);
    });
});