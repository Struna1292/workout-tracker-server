import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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