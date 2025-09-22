import crypto from 'crypto';

const generateRandomDigits = (length) => {
    length = Number(length);
    if (!length || length <= 0) {
        return undefined;
    }

    let randomCode = '';
    for (let i = 0; i < length; i++) {
        const curr = String(crypto.randomInt(0, 9));
        randomCode += curr;
    }    

    // verify if code was generated properly
    for (let i = 0; i < randomCode.length; i++) {
        if (randomCode[i] < '0' || randomCode[i] > '9') {
            return undefined;
        }
    }

    return randomCode;
}

export default generateRandomDigits;