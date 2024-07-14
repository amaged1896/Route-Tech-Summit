import { AppError } from './src/utils/appError.js';
import authRouter from './src/modules/auth/auth.router.js';
import categoryRouter from './src/modules/category/category.router.js';
import globalErrorHandler from './src/modules/error/errorController.js';
import taskRouter from './src/modules/task/task.router.js';

export const appRouter = (app, express) => {
    // Global Middleware 
    app.use(express.json());

    // auth
    app.use('/api/v1/auth', authRouter);

    // category
    app.use('/api/v1/category', categoryRouter);

    // task
    app.use('/api/v1/task', taskRouter);

    // not found page router
    app.all("*", (req, res, next) => {
        return next(new AppError('Page not found', 404));
    });
    // global error handling middleware
    app.use(globalErrorHandler);
};