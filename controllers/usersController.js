import bcrypt from 'bcrypt';

export const changePassword = async (req, res, next) => {
    try {

        const { currentPassword, newPassword } = req.body;

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

        // TO DO: validate new password

        const user = req.user;

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