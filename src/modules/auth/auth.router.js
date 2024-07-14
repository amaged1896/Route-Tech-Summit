import express from 'express';
import { login, signup } from './auth.controller.js';
import { isValid } from '../../middleware/validation.js';
import { loginSchema, signupSchema } from './auth.validation.js';
const authRouter = express.Router();

authRouter.post('/signup', isValid(signupSchema), signup);
authRouter.post('/login', isValid(loginSchema), login);

export default authRouter;