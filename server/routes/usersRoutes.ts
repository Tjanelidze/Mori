import express from 'express';

import catchAsync from "../utils/catchAsync";
import * as authController from '../controllers/authController'
import {usersLimiter} from "../middleware/rateLimmiter";

const router = express.Router();


router.post("/signup", catchAsync(authController.signup))
router.post("/login", usersLimiter, catchAsync(authController.login))
router.post("/forgotPassword", usersLimiter, catchAsync(authController.requestResetPassword))
router.post("/resetPassword", usersLimiter, catchAsync(authController.resetPassword))


export default router;