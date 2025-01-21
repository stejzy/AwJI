import { User } from "../models/user.js";
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Invalid credentials',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Invalid credentials',
            })
        }

        const accessToken = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        )
        const refreshToken = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: process.env.JWT_REFRESH_TIMEOUT || '7d' }
        )

        res.status(StatusCodes.OK).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Login failed',
            error: err.message
        });
    }
}

export const register = async (req, res) => {
    const { username, password, role } = req.body;

    const user = await User.findOne({ username });
    if (user) {
        return res.status(StatusCodes.CONFLICT).json({
            message: 'User with that username already exists.',
            errors: {
                username: 'User with that username already exists.',
            }
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(StatusCodes.CREATED).json({
            message: 'User registered successfully',
            success: true,
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to register',
            error: err.message
        })
    }
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token is required' });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
        const newAccessToken = jwt.sign(
            { id: payload.id, role: payload.role, username: payload.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );
        res.json({accessToken: newAccessToken});
    } catch (err) {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid refresh token' });
    }
}