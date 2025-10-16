// checks if there is data sent
const checkBody = (req, res, next) => {
    if (!req.body) {
        console.log('There is no data sent');
        const err = new Error('There is no data sent');
        err.status = 400;
        return next(err);
    }
    else {
        return next();
    }
};

export default checkBody;