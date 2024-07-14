import joi from 'joi';
import { isValidObjectId } from './../../middleware/validation.js';

export const createTaskSchema = joi.object({

});

export const updateTaskSchema = joi.object({

});

export const taskIdSchema = joi.object({
    id: joi.string().custom(isValidObjectId),
});
