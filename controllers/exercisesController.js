export const getUserExercises = async (req, res, next) => {
    try {

        const user = req.user;

        const exercises = await user.getExercises();

        res.status(200).json(exercises);
    }
    catch (error) {
        console.log(`Error while trying to get user exercises: ${error}`);
        const err = new Error('Internal server error while trying to get user exercises');
        err.status = 500;
        return next(err);
    }
};

export const addUserExercise = async (req, res, next) => {
    try {

        const data = req.body;

        const user = req.user;

        await user.createExercise({ name: data.name });
        
        return res.status(200).json({ message: 'Successfully added exercise' });
    }
    catch (error) {
        console.log(error);
        const err = new Error('');
        err.status = 500;
        return next(err);
    }
};