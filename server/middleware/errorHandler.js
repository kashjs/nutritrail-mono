function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).jsone({error: error.message || 'Something went wrong'});
}


module.exports = errorHandler;