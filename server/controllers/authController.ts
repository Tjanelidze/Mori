import {NextFunction, Request, Response} from "express";
import User from "../model/User";
import {signToken} from "../utils/signToken";
import AppError from "../utils/AppError";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import Token from "../model/Token";
import sendEmail from "../utils/email/sendEmail";

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

const requestResetPassword = async (req: Request, res: Response) => {
    const {email} = req.body;
    const user = await User.findOne({email});

    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If the account exists, a password reset link will be sent",
        });
    }
    const token = await Token.findOne({userId: user.get('id')})

    if (token) {
        await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, process.env.BCRYPT_SALT!);

    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();

    const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${resetToken}&id=${user._id}`;


    await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        payload: {
            name: user.username,
            link: resetLink,
            expiresIn: "30 minutes",
        },
        template: "requestResetPassword.hbs",
    });

    res.status(200).json({
        success: true,
        message: "If the account exists, a password reset link will be sent",
    });
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const {userId, token, password} = req.body;
    const passwordResetToken = await Token.findOne({userId});

    if (!passwordResetToken) {
        return next(new AppError("Invalid or expired password reset token", 400));
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
        return next(new AppError("Invalid or expired password reset token", 400));
    }

    const bcryptSalt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    await User.findByIdAndUpdate(
        userId,
        {password: hash},
        {new: true}
    );
    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError("Incorrect email", 400));
    }

    await sendEmail({
        email: user.email,
        subject: "Password Reset Successfully",
        payload: {
            name: user.username,
        },
        template: "resetPassword.hbs",
    });
    await passwordResetToken.deleteOne();

    res.status(200).json({
        success: true,
        message: "Password rested successfully",
    });
}

export {signup, login, requestResetPassword, resetPassword}