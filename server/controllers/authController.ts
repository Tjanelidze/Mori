import {NextFunction, Request, Response} from "express";
import User from "../model/User";
import {signToken} from "../utils/signToken";
import AppError from "../utils/AppError";

const signup = async (req: Request, res: Response) => {
    const {username, email, password, confirmPassword} = req.body;
    const createdUser = await User.create({username, email, password, confirmPassword});
    const token = signToken(createdUser._id.toString());

    res.status(201).json({
        status: "success",
        data: {
            createdUser,
            token
        }
    })
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new AppError("Incorrect email or password", 400));
    }

    const user = await User.findOne({email}).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id.toString());

    res.status(200).json({
        status: "success",
        token
    })
}

export {signup, login}