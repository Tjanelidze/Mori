import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['JWT_SECRET', 'JWT_EXPIRES_IN', 'BCRYPT_SALT'] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const env = {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
    bcryptSalt: process.env.BCRYPT_SALT as string
};