import User from '../models/User.js';

// loads user from database
const loadUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            console.log('User does not exist');
            const err = new Error('User does not exist');
            err.status = 404;
            return next(err);
        }
        
        req.user = user;

        return next();
    }
    catch (error) {
        console.log(`Failed to load user: ${error}`);
        const err = new Error('Internal server error while loading user');
        err.status = 500;
        return next(err);
    }
};

export default loadUser;