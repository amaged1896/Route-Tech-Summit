import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync.js';
import { User } from '../../../database/models/user.model.js';
import { AppError } from '../../utils/appError.js';

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // REMOVE PASSWORD FROM THE OUTPUT
    user.password = undefined;
    return res.status(statusCode).json({ status: 'success', token, data: { user } });
};

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) check if email and password are exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    // 2) check if user && password are correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Invalid email or password!', 401));
    }
    // 3) if everything is okay, send token to client
    createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Route')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('You are not logged in! Please log in to get access', 401));

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError('The token belonging to this user does no longer exist!', 401));

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});