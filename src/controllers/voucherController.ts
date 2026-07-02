import { Request, Response } from "express";
import { Voucher } from "../models/Voucher";
import { successResponse, errorResponse } from "../utils/response";
import slugify from "slugify";

// Get all vouchers
export const getVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(successResponse("Fetched vouchers", vouchers));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch vouchers", error));
  }
};

// Get one voucher
export const getVoucherById = async (req: Request, res: Response) => {
  try {
    const voucher = await Voucher.find({ _id: req.params.id }); 
    console.log(req.params.id)
    const list = await Voucher.find();
    console.log("Semua nama voucher:");
    list.forEach(v => console.log(v.name));
    
    if (!voucher) {
      res.status(404).json(errorResponse("Voucher not found"));
      return
    }
    res.status(200).json(successResponse("Fetched voucher", voucher));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch voucher", error));
   
  }
};

// Get one Voucher by name 
export const getVoucherByGameName = async (req: Request, res: Response) => {
  try {
    const gameName = req.params.name;
    console.log("Game name param:", req.params.name);
    const voucher = await Voucher.find({ game_name: gameName });
    if (!voucher || voucher.length === 0) {
       res.status(404).json(errorResponse("Voucher not found"));
       return
    }
    res.status(200).json(successResponse("Fetched voucher by game name", voucher));
    return
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch voucher", error));
    return
  }
};

// Create voucher
export const createVoucher = async (req: Request, res: Response) => {
  try {
    const { voucher_name, game_name, ...rest } = req.body;
    const slug = slugify(voucher_name, { lower: true, strict: true });
    const newVoucher = new Voucher({
      voucher_id: slug,
      voucher_name,
      game_name,
      ...rest,
    });
    const savedVoucher = await newVoucher.save();
    res.status(201).json(successResponse("Voucher created", savedVoucher));
    return
  } catch (error: any) {
     console.error(error);
    res.status(500).json(errorResponse("Failed to create voucher", error.message));
    return
  }
};

// Update voucher
export const updateVoucher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Gunakan _id jika id-nya dari MongoDB
    const updated = await Voucher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
       res.status(404).json(errorResponse("Voucher not found"));
       return
    }
    res.status(200).json(successResponse("Voucher updated", updated));
    return
  } catch (error: any) {
    res
      .status(500)
      .json(errorResponse("Failed to update voucher", error.message));
      return
  }
};

// Delete voucher
export const deleteVoucher = async (req: Request, res: Response) => {
  try {
    const deleted = await Voucher.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(successResponse("Voucher deleted", deleted));
    return
  } catch (error) {
    res.status(500).json(errorResponse("Failed to delete voucher", error));
    return
  }
};