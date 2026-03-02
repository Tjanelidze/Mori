import {Request, Response} from "express";
import User from "../model/User";

const signup = async (req: Request, res: Response) => {
    const {username, email, password, confirmPassword} = req.body;
    const user = await User.create({username, email, password, confirmPassword});

    res.status(201).json({
        status: "success",
        data: {
            user
        }
    })
}

export {signup}