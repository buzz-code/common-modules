import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import knex from '../config/knex';
import { User } from '../../../server/models';

/**
 * Helper to validate user state after fetching
 */
const validateAndSetUser = (user, req, res, next) => {
    if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'No such user' });
    } else if (user.toJSON().not_paid) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'חובה לשלם' });
    } else {
        req.currentUser = user;
        next();
    }
};

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

export default async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey) {
        try {
            // Safe check for column existence to prevent crash on missing migration
            const hasApiKeyColumn = await knex.schema.hasColumn('users', 'api_key');
            if (!hasApiKeyColumn) {
                console.error('Missing api_key column in users table');
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'System configuration error' });
            }

            // Expected format: "userId:secretKey"
            // This allows us to find the user efficiently, then verify the hash
            const [userId, secret] = apiKey.split(':');

            if (!userId || !secret) {
                 return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid API Key format. Use userId:secret' });
            }

            const user = await User.query({ where: { id: userId } }).fetch({ require: false });

            // If user exists and has an api_key stored, verify hash
            if (user && user.get('api_key')) {
                const isMatch = bcrypt.compareSync(secret, user.get('api_key'));
                if (isMatch) {
                    return validateAndSetUser(user, req, res, next);
                }
            }
            
            return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid API Key credentials' });

        } catch (err) {
            console.error('API Key Auth Error:', err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Authentication error' });
        }
    }

    const authorizationHeader = req.headers['authorization'];
    let token;

    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: 'You are not authorized to perform this operation!' });
            } else {
                User.query({
                    where: { id: decoded.id },
                }).fetch({ require: false }).then(user => {
                    validateAndSetUser(user, req, res, next);
                });
            }
        });
    } else {
        res.status(HttpStatus.FORBIDDEN).json({
            error: 'No token provided'
        });
    }
};