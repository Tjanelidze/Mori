import jwt from 'jsonwebtoken';
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

    const decoded = jwt.verify(token, env.jwtSecret) as { id: string };

    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = currentUser;
    next();
};

export default authMiddleware;
