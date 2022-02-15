import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';

/**
 * Admin user is already created in database
 * as a placeholder for the purpose of testing
 * and using routes that require user token authorization.
 *
 * API tester can obtain the admin token by visiting /admin path.
 */
const adminUser: User = {
    id: 1,
    first_name: 'Admin',
    last_name: 'User',
    password: 'password',
};

type UserPayload = Omit<User, 'id' | 'password'> & { sub: number };

type UserCredentials = Omit<User, 'password'>;

function stripUserPassword(user: User): UserCredentials {
    return {
        id: user.id as number,
        first_name: user.first_name,
        last_name: user.last_name,
    };
}

function toUserPayload(user: User): UserPayload {
    return {
        sub: user.id as number,
        first_name: user.first_name,
        last_name: user.last_name,
    };
}

const generateUserToken = (payload: UserPayload): string => {
    return jwt.sign(payload, process.env.SIGN_HASH as string);
};

const getAdminToken = () => generateUserToken(toUserPayload(adminUser));

export {
    /**
     * Types
     */
    UserPayload,
    UserCredentials,
    /**
     * Utility functions
     */
    stripUserPassword,
    toUserPayload,
    adminUser,
    generateUserToken,
    getAdminToken,
};
