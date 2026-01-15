import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { User } from '../../../server/models';

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

export default (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        User.query({
            where: { api_key: apiKey },
        }).fetch({ require: false }).then(user => {
            if (!user) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid API Key' });
            } else if (user.toJSON().not_paid) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: 'חובה לשלם' });
            } else {
                req.currentUser = user;
                next();
            }
        }).catch(err => {
             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Authentication error' });
        });
        return;
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
                    if (!user) {
                        res.status(HttpStatus.NOT_FOUND).json({ error: 'No such user' });
                    } else if (user.toJSON().not_paid) {
                        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'חובה לשלם' });
                    } else {
                        req.currentUser = user;
                        next();
                    }

                });
            }
        });
    } else {
        res.status(HttpStatus.FORBIDDEN).json({
            error: 'No token provided'
        });
    }
};