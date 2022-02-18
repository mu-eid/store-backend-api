import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { User } from '../models/user';

type UserPayload = { sub: number } & Pick<User, 'username'>;

type UserCredentials = Omit<User, 'password'>;

function stripPassword(user: User): UserCredentials {
    return {
        id: user.id as number,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
    };
}

function toUserPayload(user: User): UserPayload {
    return {
        sub: user.id as number,
        username: user.username,
    };
}

const genUserToken = (payload: UserPayload): string => {
    return jwt.sign(payload, process.env.SIGN_HASH as string);
};

const encryptPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, process.env.SALT_HASH as string);
};

export {
    /**
     * Types
     */
    UserPayload,
    UserCredentials,
    /**
     * Utility functions
     */
    encryptPassword,
    stripPassword,
    toUserPayload,
    genUserToken,
};
