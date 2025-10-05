// checks X-Last-Sync header and if user is synchronized
const checkSync = async (req, res, next) => {

    const header = req.headers['x-last-sync'];
    
    if (!header) {
        console.log('No X-Last-Sync header');
        const err = new Error('Missing X-Last-Sync header');
        err.status = 428;
        return next(err);
    }

    const lastSync = new Date(header);

    if (lastSync == 'Invalid Date') {
        console.log('Invalid date format in X-Last-Sync header');
        const err = new Error('Invalid date format in X-Last-Sync header');
        err.status = 400;
        return next(err);
    }

    const user = req.user;

    const serverLastSync = new Date(user.last_sync);

    if (lastSync.getTime() != serverLastSync.getTime()) {
        console.log('Provided X-Last-Sync does not match with the server');
        const err = new Error('Provided X-Last-Sync does not match with the server');
        err.status = 412;
        return next(err);
    }

    return next();
};

export default checkSync;