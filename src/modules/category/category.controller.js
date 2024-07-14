import { AppError } from '../../utils/appError.js';
import { catchAsync } from './../../utils/catchAsync.js';
import { Category } from './../../../database/models/category.model.js';
import APIFeatures from './../../utils/apiFeatures.js';


export const getAllCategories = catchAsync(async (req, res, next) => {

    const apiFeatures = new APIFeatures(Category.find({}), req.query)
        .Find()
        .paginate()
        .filter()
        .sort()
        .limitFields()
        .search();

    const categories = await apiFeatures.query;
    if (!categories.length) return next(new AppError("There are no categories."));
    return res.status(200).json({ status: "success", categories });
});

export const getSingleCategory = catchAsync(async (req, res, next) => {
    const category = await Category.find({ $or: [{ _id: req.params.id }, { name: req.body.name }] });
    if (!category) return next(new AppError("Category Not Exist."));
    return res.status(201).json({ status: "success", category });
});

export const createCategory = catchAsync(async (req, res, next) => {
    console.log("hello");
    const category = await Category.findOne({ name: req.body.name });
    console.log("category => ", category);
    if (category) return next(new AppError("Category already exist."));

    const newCategory = await Category.create({ name: req.body.name, user: req.user._id });
    return res.status(201).json({ status: "success", message: "category created successfully.", category: newCategory });
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({ _id: req.params.id });
    console.log(category);
    if (!category) return next(new AppError("Category Not Exist."));

    category.name = req.body.name;
    category.user = req.body.user;
    await category.save();

    return res.status(201).json({ status: "success", message: "category updated successfully.", category });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById({ _id: req.params.id });
    if (!category) return next(new AppError("Category Not Exist."));
    await Category.findByIdAndDelete({ _id: req.params.id });
    return res.status(201).json({ status: "success", message: "category deleted successfully." });
});