const errorMiddleware = (err, req, res, next) => {
    // Log unexpected errors during development
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;