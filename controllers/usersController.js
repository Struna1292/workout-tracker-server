import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { 
    validatePassword,
    validateEmail,
    validateUsername,
} from '../validations/userValidations.js';
import sequelize from '../db.js';

export const changePassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        if (!currentPassword) {
            console.log('No current password provided');
            const err = new Error('No current password provided');
            err.status = 400;
            return next(err);
        }

        if (!newPassword) {
            console.log('No new password provided');
            const err = new Error('No new password provided');
            err.status = 400;
            return next(err);
        }

        const errors = [];

        validatePassword(newPassword, errors);

        if (errors.length > 0) {
            console.log('Failed to change password');
            const err = new Error('Failed to change password');
            err.status = 422;
            err.details = errors;
            return next(err);
        }
        
        if (!(await bcrypt.compare(currentPassword, user.password))) {
            console.log('Wrong password');
            const err = new Error('Wrong password');
            err.status = 400;
            return next(err);
        }

        // hash new password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(newPassword, salt);
        
        user.password = hash;
        await user.save();

        console.log('Successfully changed password');
        return res.status(200).json({ message: 'Successfully changed password' });
    }
    catch (error) {
        console.log(`Error while trying to change password: ${error}`);
        const err = new Error('Internal server error while trying to change password');
        err.status = 500;
        return next(err);
    }
};

export const removeEmail = async (req, res, next) => {
    try {
        const user = req.user;

        // check if user has email
        if (!user.email) {  
            console.log('User has no e-mail');
            const err = new Error('User has no e-mail');
            err.status = 400;
            return next(err);
        }

        // no password needed to remove not verified email
        if (!user.email_verified) {
            console.log('Successfully removed e-mail'); 
            user.email = null;
            await user.save();
            return res.status(200).json({ message: 'Successfully removed e-mail' });
        }

        if (!req.body || !req.body.password) {
            console.log('No password provided');
            const err = new Error('No password provided');
            err.status = 400;
            return next(err);
        }

        const { password } = req.body;

        if (!(await bcrypt.compare(password, user.password))) {
            console.log('Wrong password');
            const err = new Error('Wrong password');
            err.status = 400;
            return next(err);
        }

        user.email = null;
        user.email_verified = false;
        await user.save();

        return res.status(200).json({ message: 'Successfully removed e-mail' });
    }
    catch (error) {
        console.log(`Error while trying to remove e-mail: ${error}`);
        const err = new Error('Internal server error while trying to remove user e-mail');
        err.status = 500;
        return next(err);
    }
};

export const addEmail = async (req, res, next) => {
    try {

        const { email } = req.body;
        const user = req.user;

        if (user.email != null) {
            console.log('User already has email');
            const err = new Error('User already has email');
            err.status = 400;
            return next(err);
        }

        const errors = [];

        validateEmail(email, errors);

        if (errors.length > 0) {
            console.log('Failed to add email');
            const err = new Error('Failed to add email');
            err.status = 422;
            err.details = errors;
            return next(err);
        }

        user.email = email;
        await user.save();

        return res.status(200).json({ message: 'Successfully added email' });
    }
    catch (error) {
        console.log(`Error while trying to add email: ${error}`);
        const err = new Error('Internal server error while trying to add email');
        err.status = 500;
        return next(err);
    }
};

export const changeUsername = async (req, res, next) => {
    try {

        const { username } = req.body;
        const user = req.user;

        const errors = [];

        validateUsername(username, errors);

        if (errors.length > 0) {
            console.log('Failed to change username');
            const err = new Error('Failed to change username');
            err.status = 422;
            err.details = errors;
            return next(err);
        }
        
        // check if given username is the same
        if (user.username == username) {
            console.log('Username is the same');
            const err = new Error('Given username is the same');
            err.status = 400;
            return next(err);
        }

        // check if given username is the same in lowercase as current
        if (user.username.toLowerCase() == username.toLowerCase()) {

            user.username = username;

            await user.save();

            return res.status(200).json({ message: 'Successfully changed username' });
        }

        const differentUser = await User.findOne({ where: sequelize.where(
            sequelize.fn('LOWER', sequelize.col('username')),
            username.toLowerCase() 
        )});

        if (differentUser) {
            console.log('Username taken');
            const err = new Error('This username is already taken');
            err.status = 400;
            return next(err);
        }

        user.username = username;

        await user.save();

        return res.status(200).json({ message: 'Successfully changed username' });
    }
    catch (error) {
        console.log(`Error while trying to change username: ${error}`);
        const err = new Error('Internal server error while trying to change username');
        err.status = 500;
        return next(err);
    }
};