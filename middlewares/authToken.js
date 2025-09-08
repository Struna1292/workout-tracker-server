import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authToken = (req, res, next) => {

    const header = req.headers['authorization'];

    if (!header) {
        console.log('No authorization header');
        const err = new Error('No authorization header');
        err.status = 401;
        return next(err);
    }

    const token = header.split('Bearer ')[1];

    if (!token) {
        console.log('Invalid authorization header format');
        const err = new Error('Invalid authorization header format');
        err.status = 401;
        return next(err);        
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        return next();
    }
    catch (error) {
        console.log(`Error while trying to verify token: ${error}`);
        if (error.name == 'TokenExpiredError') {
            const err = new Error('Token expired');
            err.status = 401;
            return next(err);
        }
        else {
            const err = new Error('Invalid token');
            err.status = 403;
            return next(err);
        }
    }
};

export default authToken;