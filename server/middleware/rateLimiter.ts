import {rateLimit, Options} from "express-rate-limit";

const baseConfig: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
};

const createLimiter = (limit: number, message: string) =>
    rateLimit({
        ...baseConfig,
        limit,
        message: {status: 'fail', message},
    });

export const globalLimiter = createLimiter(
    100,
    'Too many requests from this IP, please try again after 15 minutes'
);

export const usersLimiter = createLimiter(
    5,
    'Too many login attempts from this IP, please try again after 15 minutes'
);

export const forgotPasswordLimiter = createLimiter(
    5,
    'Too many password reset requests from this IP, please try again after 15 minutes'
);

export const resetPasswordLimiter = createLimiter(
    5,
    'Too many reset attempts from this IP, please try again after 15 minutes'
);