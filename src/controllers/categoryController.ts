import { Request, Response } from "express";
import { Category } from "../models/Category";
import { successResponse, errorResponse } from "../utils/response";

// Get all Categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(successResponse("Fetched categories", categories));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch categories", error));
  }
};

// Get one category
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.find({ _id: req.params.id });
    console.log(req.params.id);
    const list = await Category.find();
    console.log("Semua nama Category:");
    list.forEach((v) => console.log(v.name));

    if (!category) {
      res.status(404).json(errorResponse("category not found"));
      return;
    }
    res.status(200).json(successResponse("Fetched voucher", category));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch voucher", error));
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();

    res.status(201).json(successResponse("Category created", savedCategory));
    return;
  } catch (error: any) {
    console.error(error);

    res
      .status(500)
      .json(errorResponse("Failed to create Category", error.message));
    return;
  }
};

// Update Category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json(errorResponse("Category not found"));
      return;
    }
    res.status(200).json(successResponse("Category updated", updated));
    return;
  } catch (error: any) {
    res
      .status(500)
      .json(errorResponse("Failed to update Category", error.message));
    return;
  }
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleted = await Category.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(successResponse("Category deleted", deleted));
    return;
  } catch (error) {
    res.status(500).json(errorResponse("Failed to delete Category", error));
    return;
  }
};
