// checks if user provided startDate and endDate and verify if they are proper Date format
const checkDateQueryParams = (req, res, next) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    if (!endDate) {
        console.log('No endDate query param provided');
        const err = new Error('No endDate query param provided');
        err.status = 400;
        return next(err);
    }

    endDate = new Date(endDate);
    if (endDate == 'Invalid Date') {
        console.log('endDate query param invalid date');
        const err = new Error('endDate query param invalid date');
        err.status = 400;
        return next(err);
    }

    if (startDate) {
        startDate = new Date(startDate);
        if (startDate == 'Invalid Date') {
            console.log('startDate query param invalid date');
            const err = new Error('startDate query param invalid date');
            err.status = 400;
            return next(err);
        }

        if (startDate.getTime() >= endDate.getTime()) {
            console.log('startDate cant be the same or older than endDate');
            const err = new Error('startDate cant be the same or older than endDate');
            err.status = 400;
            return next(err);            
        }
    }

    req.startDate = startDate;
    req.endDate = endDate;

    return next();
};

export default checkDateQueryParams;