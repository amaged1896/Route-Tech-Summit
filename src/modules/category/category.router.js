import express from 'express';
import { isValid } from '../../middleware/validation.js';
import { createCategorySchema, categoryIdSchema, updateCategorySchema } from './category.validation.js';
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from './category.controller.js';
import { protect } from './../auth/auth.controller.js';
import taskRouter from './../task/task.router.js';
const categoryRouter = express.Router();
categoryRouter.use("/:id/tasks", taskRouter);

categoryRouter.get("/", getAllCategories);
categoryRouter.post("/", protect, isValid(createCategorySchema), createCategory);

categoryRouter.route("/:id")
    .patch(protect, isValid(updateCategorySchema), updateCategory)
    .delete(protect, isValid(categoryIdSchema), deleteCategory)
    .get(protect, isValid(categoryIdSchema), getSingleCategory);

export default categoryRouter;