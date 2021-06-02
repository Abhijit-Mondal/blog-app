// middleware function to log time
const timeLogger = (req, res, next) => {
    console.log(`Time: ${Date.now()}`);
    next();
};

export default timeLogger;
