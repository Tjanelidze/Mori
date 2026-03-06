import {Request, Response} from "express";
import User from "../model/User";
import {signToken} from "../utils/signToken";

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

export {signup}