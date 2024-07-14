import joi from 'joi';
import { isValidObjectId } from './../../middleware/validation.js';

export const createCategorySchema = joi.object({
    name: joi.string().required(),
    user: joi.string().custom(isValidObjectId).required(),
}).required();

export const updateCategorySchema = joi.object({
    name: joi.string(),
    user: joi.string().custom(isValidObjectId),
    id: joi.string().custom(isValidObjectId),
}).required();

export const categoryIdSchema = joi.object({
    id: joi.string().custom(isValidObjectId),
}).required();

