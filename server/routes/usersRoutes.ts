import express from 'express';
import catchAsync from "../utils/catchAsync";

import * as authController from '../controllers/authController'

const router = express.Router();

router.post("/signup", catchAsync(authController.signup))
router.post("/login", catchAsync(authController.login))


export default router;