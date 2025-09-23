import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import generateRandomDigits from '../utils/generateRandomDigits.js';
import ConfirmationCode from '../models/ConfirmationCode.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // check if user exists
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }

        if (await bcrypt.compare(password, user.password)) {

            const accessToken = jwt.sign({
                id: user.id,
                username: user.username,
            }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION});

            const refreshToken = jwt.sign({
                id: user.id,
                username: user.username,
            }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION});

            // hash refresh token
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(refreshToken, salt);        
            
            user.refresh_token = hash;
            await user.save();

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in miliseconds
            });

            return res.status(200).json({ message: 'logged in', token: accessToken });
        }
        else {
            console.log(`Invalid password`);
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }
    }
    catch (error) {
        console.log(`Error while trying to login user: ${error}`);
        const err = new Error('Internal server error while trying to login');
        err.status = 500;
        return next(err);
    }
};

export const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // check if user already exists
        const user = await User.findOne({ where: { username: username } });
        if (user) {
            const err = new Error('User already exists');
            err.status = 400;
            return next(err);
        }
        
        // hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        await User.create({ 
            username: username,
            password: hash, 
        });

        return res.status(201).json({ message: 'Successfully registered' });
    }
    catch (error) {
        console.log(`Error while creating user account: ${error}`);
        const err = new Error('Internal server error while creating user account');
        err.status = 500;
        return next(err);
    }
}

export const refreshToken = async (req, res, next) => {
    if (req.cookies.refreshToken) {
        const refreshToken = req.cookies.refreshToken;

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            const user = await User.findByPk(decoded.id);
            if (!user) {
                const err = new Error('User does not exist');
                err.status = 400;
                return next(err);
            }

            if (await bcrypt.compare(refreshToken, user.refresh_token)) {

                const accessToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION});
                
                // token rotation
                const newRefreshToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION});

                // hash refresh token
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hash = await bcrypt.hash(newRefreshToken, salt);        
                
                user.refresh_token = hash;
                await user.save();

                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in miliseconds
                });

                return res.status(200).json({ message: 'Token successfully refreshed', token: accessToken });
            }
            else {
                // refresh token probably stolen
                user.refresh_token = '';
                await user.save();
                res.clearCookie('refreshToken');

                const err = new Error('Invalid refresh token'); 
                err.status = 401;
                return next(err);
            }
        }
        catch (error) {
            console.log(`Error while verifying refresh token: ${error}`);
            const err = new Error('Invalid refresh token');
            err.status = 401;
            return next(err);
        }
    }
    else {
        return res.status(406).json({ message: 'Unauthorized' });
    }
};

export const logoutToken = async (req, res, next) => {
    if (req.cookies.refreshToken) {
        const refreshToken = req.cookies.refreshToken;

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            const user = await User.findByPk(decoded.id);

            if (!user) {
                const err = new Error('User does not exist');
                err.status = 400;
                return next(err);
            }

            if (await bcrypt.compare(refreshToken, user.refresh_token)) {

                user.refresh_token = '';
                await user.save();

                res.clearCookie('refreshToken');
                return res.status(200).json({ message: 'Refresh token successfully removed' });
            }
            else {
                const err = new Error('Invalid refresh token');
                err.status = 401;
                return next(err);
            }
        }
        catch (error) {
            console.log(`Error while removing refresh token: ${error}`);
            const err = new Error('Internal server error while removing refresh token');
            err.status = 500;
            return next(err);
        }        
    }
    else {
        return res.status(406).json({ message: 'Unauthorized' });
    }
};

export const getEmailVerificationCode = async (req, res, next) => {
    try {

        const user = req.user;

        if (!user) {
            console.log('User does not exist');
            const err = new Error('User does not exist');
            err.status = 404;
            return next(err);
        }

        if (!user.email) {
            console.log('User has no e-mail');
            const err = new Error('User did not provide e-mail');
            err.status = 404;
            return next(err);
        }

        // generate 6 digits random code
        const randomCode = generateRandomDigits(6);

        if (!randomCode) {
            console.log('Failed to generate random code');
            const err = new Error('Internal server error while generating random code');
            err.status = 500;
            return next(err);
        }

        // hash code
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const codeHash = await bcrypt.hash(randomCode, salt);

        const codeData = {
            user_id: user.id,
            code: codeHash,
            code_date: new Date(),
            type: 'email-verification'
        };

        // check if user already has email verification code
        const code = (await user.getCodes({ where: { type: 'email-verification' } }))[0];
        if (code) {
            code.code = codeData.code;
            code.code_date = codeData.code_date;

            await code.save();
        }
        else {
            await ConfirmationCode.create(codeData);
        }
        
        const subject = 'E-mail verification';
        const message = `
            <h1>Verification Code<h1>
            <h2>${randomCode}</h2>
        `;
        const error = await sendEmail(user.email, subject, message);

        if (error) {
            const err = new Error('Internal server error while trying to send email');
            err.status = 500;
            return next(err);
        }        

        console.log('Successfully sent email verification code');
        return res.status(200).json({ message: 'Successfully sent verification code'});
    }
    catch (error) {
        console.log(`Error while sending email with verification code: ${error}`);
        const err = new Error('Internal server error while sending email with verification code');
        err.status = 500;
        return next(err);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user.email) {
            console.log('User has no e-mail');
            const err = new Error('User did not provide e-mail');
            err.status = 404;
            return next(err);
        }

        if (user.email_verified) {
            console.log('E-mail already verified');
            const err = new Error('E-mail already verified');
            err.status = 400;
            return next(err);
        }
        
        const code = req.body.code;

        if (!code) {
            console.log('There is no verification code');
            const err = new Error('There is no verification code');
            err.status = 400;
            return next(err);            
        }

        const confirmationCode = (await user.getCodes({ where: { type: 'email-verification' } }))[0];

        if (!(await bcrypt.compare(code, confirmationCode.code))) {
            console.log('Wrong verification code');
            const err = new Error('Wrong verification code');
            err.status = 400;
            return next(err);
        }
        
        const currDate = new Date();
        // add 5 minutes to code generation date
        const expirationDate = new Date(confirmationCode.code_date);
        const minutes = expirationDate.getMinutes() + 5;
        expirationDate.setMinutes(minutes);

        if (currDate > expirationDate) {
            console.log('Verification code expired');
            const err = new Error('Verification code expired');
            err.status = 400;
            return next(err);            
        }

        user.email_verified = true;
        await user.save();
        
        console.log('E-mail verified');
        return res.status(200).json({ message: 'Successfully verified email' });
    }
    catch (error) {
        console.log(`Error while verifying code: ${error}`);
        const err = new Error('Internal server error while verifying code');
        err.status = 500;
        return next(err);
    }
};

export const getForgotPasswordCode = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            console.log('No username provided');
            const err = new Error('No username provided');
            err.status = 400;
            return next(err);
        }

        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            console.log('User does not exist');
            const err = new Error('User does not exist');
            err.status = 404;
            return next(err);
        }

        if (!user.email_verified) {
            console.log('User has no verified email');
            const err = new Error('User has no verified email');
            err.status = 400;
            return next(err);            
        }

        // generate 6 digits random code
        const randomCode = generateRandomDigits(6);
        if (!randomCode) {
            console.log('Failed to generate random code');
            const err = new Error('Internal server error while generating random code');
            err.status = 500;
            return next(err);
        }

        // hash code
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const codeHash = await bcrypt.hash(randomCode, salt);

        const codeData = {
            user_id: user.id,
            code: codeHash,
            code_date: new Date(),
            type: 'forgot-password'
        };

        // check if user already has forgot password code
        const code = (await user.getCodes({ where: { type: 'forgot-password' } }))[0];
        if (code) {
            code.code = codeData.code;
            code.code_date = codeData.code_date;

            await code.save();
        }
        else {
            await ConfirmationCode.create(codeData);
        }

        const subject = 'Password recovery';
        const message = `
            <h1>Password Recovery Code<h1>
            <h2>${randomCode}</h2>
        `;
        const error = await sendEmail(user.email, subject, message);

        if (error) {
            const err = new Error('Internal server error while trying to send email');
            err.status = 500;
            return next(err);
        }        

        console.log('Successfully sent email with forgot password code');
        return res.status(200).json({ message: 'Successfully sent forgot password code' });
    }
    catch (error) {
        console.log(`Error while sending email with password recovery code: ${error}`);
        const err = new Error('Internal server error while sending email with password recovery code');
        err.status = 500;
        return next(err);
    }
};