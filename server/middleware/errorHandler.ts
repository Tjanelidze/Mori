import AppError from '../utils/AppError.js';
import {NextFunction, Request, Response} from 'express';

interface MongoCastError extends Error {
    path: string;
    value: string;
}

function isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
}

function isCastError(err: unknown): err is MongoCastError {
    return (err as MongoCastError).name === 'CastError' && 'path' in (err as object);
}

const handleCastErrorDB = (err: MongoCastError): AppError => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};


const sendErrorDev = (err: AppError | Error, res: Response) => {
    const statusCode = isAppError(err) ? err.statusCode : 500;
    const status = isAppError(err) ? err.status : 'error';

    res.status(statusCode).json({
        status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: AppError | Error, res: Response) => {
    if (isAppError(err) && err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error: don't leak details
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errorInstance = err ? err : new Error(String(err));

    console.error('Global error handler caught: ', err); // For immediate server visibility


    if (res.headersSent) {
        next(errorInstance);
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(errorInstance, res);
    } else if (process.env.NODE_ENV === 'production') {
        let prodError = Object.assign(errorInstance);
        prodError.message = errorInstance.message;

        if (isCastError(errorInstance)) prodError = handleCastErrorDB(errorInstance);

        sendErrorProd(prodError, res);
    } else {
        sendErrorDev(errorInstance, res);
    }
};

export default errorHandler;
