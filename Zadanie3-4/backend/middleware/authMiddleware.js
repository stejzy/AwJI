import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = (requireEmployeeRole = false, requireClientRole = false) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token || !authHeader.startsWith('Bearer ')) {
            return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Access token is required'});
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(StatusCodes.FORBIDDEN).json({message: 'Invalid token'});
            }

            if (requireEmployeeRole && user.role !== 'PRACOWNIK') {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'Insufficient privileges. Only employees can perform this action.' });
            }

            if (requireClientRole && user.role !== 'KLIENT') {
                return res.status(StatusCodes.FORBIDDEN).json({ message: 'Insufficient privileges. Only clients can perform this action.' });
            }

            req.user = user;
            next();
        });
    };
};