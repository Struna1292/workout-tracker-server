const notFound = (req, res, next) => {
    const err = new Error('404 Not Found');
    err.status = 404;
    return next(err);
};

export default notFound;