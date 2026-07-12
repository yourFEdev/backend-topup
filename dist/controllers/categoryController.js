"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const Category_1 = require("../models/Category");
const response_1 = require("../utils/response");
// Get all Categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category_1.Category.find();
        res.status(200).json((0, response_1.successResponse)("Fetched categories", categories));
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch categories", error));
    }
};
exports.getCategories = getCategories;
// Get one category
const getCategoryById = async (req, res) => {
    try {
        const category = await Category_1.Category.find({ _id: req.params.id });
        console.log(req.params.id);
        const list = await Category_1.Category.find();
        console.log("Semua nama Category:");
        list.forEach((v) => console.log(v.name));
        if (!category) {
            res.status(404).json((0, response_1.errorResponse)("category not found"));
            return;
        }
        res.status(200).json((0, response_1.successResponse)("Fetched voucher", category));
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to fetch voucher", error));
    }
};
exports.getCategoryById = getCategoryById;
// Create category
const createCategory = async (req, res) => {
    try {
        const newCategory = new Category_1.Category(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json((0, response_1.successResponse)("Category created", savedCategory));
        return;
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json((0, response_1.errorResponse)("Failed to create Category", error.message));
        return;
    }
};
exports.createCategory = createCategory;
// Update Category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Category_1.Category.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            res.status(404).json((0, response_1.errorResponse)("Category not found"));
            return;
        }
        res.status(200).json((0, response_1.successResponse)("Category updated", updated));
        return;
    }
    catch (error) {
        res
            .status(500)
            .json((0, response_1.errorResponse)("Failed to update Category", error.message));
        return;
    }
};
exports.updateCategory = updateCategory;
// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const deleted = await Category_1.Category.findOneAndDelete({ _id: req.params.id });
        res.status(200).json((0, response_1.successResponse)("Category deleted", deleted));
        return;
    }
    catch (error) {
        res.status(500).json((0, response_1.errorResponse)("Failed to delete Category", error));
        return;
    }
};
exports.deleteCategory = deleteCategory;
