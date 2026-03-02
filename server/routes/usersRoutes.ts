import express from 'express';
import catchAsync from "../utils/catchAsync";

import * as authController from '../controllers/authController'

const router = express.Router();

router.post("/", catchAsync(authController.signup))


export default router;