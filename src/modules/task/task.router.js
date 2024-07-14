import express from 'express';
import { createTaskSchema, taskIdSchema, updateTaskSchema } from './task.validation.js';
import { createTask, deleteTask, getAllTasks, getSingleTask, updateTask } from './task.controller.js';
import { protect } from './../auth/auth.controller.js';
import { isValid } from '../../middleware/validation.js';
const taskRouter = express.Router({ mergeParams: true });


taskRouter.route("/")
    .get(protect, getAllTasks)
    .post(protect, createTask);

taskRouter.route("/:id")
    .get(protect, isValid(taskIdSchema), getSingleTask)
    .patch(protect, isValid(updateTaskSchema), updateTask)
    .delete(protect, isValid(taskIdSchema), deleteTask);

export default taskRouter;