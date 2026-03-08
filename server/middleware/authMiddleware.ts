import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {env} from '../config/env';
import {NextFunction, Request, Response} from 'express';
import AppError from "../utils/AppError";
import User from "../model/User";

const authMiddleware = async function (
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access.", 401))
    }

    let decoded: { id: string };
    try {
        decoded = jwt.verify(token, env.jwtSecret) as { id: string };
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return next(new AppError('Your token has expired. Please log in again.', 401));
        }
        return next(new AppError('Invalid token. Please log in again.', 401));
    }

    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = currentUser;
    next();
};

export default authMiddleware;
