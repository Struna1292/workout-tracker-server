export const validateUsername = (username, errors) => {
    if (!username) {
        errors.push('Missing username');
        return;
    }

    if (typeof username != 'string') {
        errors.push('Username needs to be a string');
        return;
    }

    if (username.length < 3) {
        errors.push('Username needs to be atleast 3 characters long');
        return;
    }

    if (username.length > 255) {
        errors.push('Username too long, max length 255');
        return;
    }    
};

export const validatePassword = (password, errors) => {
    if (!password) {
        errors.push('Missing password');
        return;
    }

    if (typeof password != 'string') {
        errors.push('Password needs to be a string');
        return;
    }

    if (password.length < 8) {
        errors.push('Password needs to be atleast 8 characters long');
        return;        
    }

    if (password.length > 255) {
        errors.push('Password too long, max length 255');
        return;        
    }

    let digit = false;
    let lowerCase = false;
    let upperCase = false;
    let specialCharacter = false;

    for (const char of password) {
        if (char >= '0' && char <= '9') {
            digit = true;
        }
        else if (char >= 'a' && char <= 'z') {
            lowerCase = true;
        }
        else if (char >= 'A' && char <= 'Z') {
            upperCase = true;
        }
        else {
            specialCharacter = true;
        }
    }

    if (!digit) {
        errors.push('Password must contain digit');
    }

    if (!lowerCase) {
        errors.push('Password must contain lower case english letter');
    }

    if (!upperCase) {
        errors.push('Password must contain upper case english letter');
    }

    if (!specialCharacter) {
        errors.push('Password must contain special character');
    }

};

export const validateEmail = (email, errors) => {
    if (!email) {
        errors.push('Missing email');
        return;
    }

    if (typeof email != 'string') {
        errors.push('Email needs to be a string');
        return;
    }

    let atSign = false;

    for (const char of email) { 
        if (char == '@') {
            atSign = true;
            break;
        }
    }

    if (!atSign) {
        errors.push('Email must contain @ sign');
    }
};