import express from 'express';

import catchAsync from "../utils/catchAsync";
import * as authController from '../controllers/authController';
import {forgotPasswordLimiter, resetPasswordLimiter, usersLimiter} from "../middleware/rateLimiter";

const router = express.Router();


router.post("/signup", catchAsync(authController.signup));
router.post("/login", usersLimiter, catchAsync(authController.login));
router.post("/forgotPassword", forgotPasswordLimiter, catchAsync(authController.requestResetPassword));
router.post("/resetPassword", resetPasswordLimiter, catchAsync(authController.resetPassword));


export default router;