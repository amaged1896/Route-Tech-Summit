import { Task } from './../../../database/models/task.model.js';
import { catchAsync } from './../../utils/catchAsync.js';
import { AppError } from './../../utils/appError.js';
import { Category } from '../../../database/models/category.model.js';
import APIFeatures from '../../utils/apiFeatures.js';

export const getAllTasks = catchAsync(async (req, res, next) => {

    const apiFeatures = new APIFeatures(Task.find({}), req.query)
        .Find()
        .paginate()
        .filter()
        .sort()
        .limitFields()
        .search();

    const tasks = await apiFeatures.query;
    return res.status(200).json({ status: "success", tasks });
});

export const createTask = catchAsync(async (req, res, next) => {

    if (req.body.type === "text") {
        console.log("task type is text");
        const isExist = await Task.findOne({ textBody: req.body.textBody, creator: req.user._id });
        if (isExist) return next(new AppError("Task already exists."));

        const task = await Task.create({
            type: req.body.type,
            visible: req.body.visible,
            creator: req.user._id,
            textBody: req.body.textBody,
            category: req.body.category
        });
        return res.status(200).json({ status: "success", task });

    } else if (req.body.type === "list") {
        console.log("task type is list");

        const existingTasks = await Task.find({
            type: req.body.type,
            visible: req.body.visible,
            creator: req.user._id,
            category: req.body.category,
            listTasks: { $all: req.body.listTasks }
        });

        if (existingTasks.length > 0) {
            return res.status(400).json({ status: "error", message: "Tasks with the same listTasks already exist." });
        }

        const newTasks = req.body.listTasks.filter(task => !existingTasks.some(existingTask => existingTask.listTasks.includes(task)));

        const createdTasks = await Task.create({
            type: req.body.type,
            visible: req.body.visible,
            creator: req.user._id,
            listTasks: newTasks,
            category: req.body.category
        });

        return res.status(200).json({ status: "success", tasks: createdTasks });
    }
    return next(new AppError("Please enter a task type", 400));

});

export const updateTask = catchAsync(async (req, res, next) => {
    // check task existence
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError("Task not found", 404));

    // Check the type of task (text or list)
    if (task.type === 'text') {
        // Update text task
        task.visible = req.body.visible || task.visible;
        task.textBody = req.body.textBody || task.textBody;
        task.category = req.body.category || task.category;
    } else if (task.type === 'list') {
        // Update list task
        task.visible = req.body.visible || task.visible;

        // Assuming listTasks is an array
        task.listTasks = req.body.listTasks || task.listTasks;
        task.category = req.body.category || task.category;
    }
    // Save the updated task
    const updatedTask = await Task.save();

    return res.status(200).json({ status: "success", updatedTask });
});

export const deleteTask = catchAsync(async (req, res, next) => {
    // check task existence
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError("Task not found", 404));

    // delete the task
    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({ status: "success", message: "Task deleted successfully!" });
});

export const getSingleTask = catchAsync(async (req, res, next) => {
    // check task existence
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError("Task not found", 404));

    return res.status(200).json({ status: "success", task });
});

export const getCategoryTasks = catchAsync(async (req, res, next) => {
    // check category existence
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));
    const tasks = await Task.find({ _id: category._id });
    return res.status(200).json({ status: "success", tasks });
});