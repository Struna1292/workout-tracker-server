const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    return next();
};

export default logger;