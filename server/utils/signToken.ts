import jwt, {SignOptions} from 'jsonwebtoken'
import {env} from "../config/env";

export const signToken = (id: string) => {
    const options: SignOptions = {
        expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
        algorithm: 'HS256',
    };

    return jwt.sign({id}, env.jwtSecret, options);
}