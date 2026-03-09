import express from 'express';
import catchAsync from "../utils/catchAsync";
import {rateLimit} from "express-rate-limit";

import * as authController from '../controllers/authController'

const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        status: 'fail',
        message: 'Too many login attempts from this IP, please try again after 15 minutes'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

router.post("/signup", catchAsync(authController.signup))
router.post("/login", limiter, catchAsync(authController.login))


export default router;