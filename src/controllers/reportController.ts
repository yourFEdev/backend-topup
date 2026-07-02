import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";

export const getDailyReport = async (req: Request, res: Response) => {
  try {
    const result = await Transaction.aggregate([
      {
        $addFields: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          totalPemasukan: { $sum: "$variant.price" },
          jumlahTransaksi: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 }, 
      },
    ]);

    res.json({
      status: "success",
      result,
    });
    return
  } catch (err) {
    res.status(500).json({ status: "error", message: err });
    return
  }
};

export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const query: any = { payment_status: "paid" };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    // Hitung total penjualan
    const totalRevenue = transactions.reduce((sum, t) => sum + t.variant.price, 0);

    // Hitung jumlah transaksi
    const totalTransactions = transactions.length;

    // Hitung produk terlaris
    const productCount: Record<string, number> = {};
    transactions.forEach((t) => {
      productCount[t.voucher_name] = (productCount[t.voucher_name] || 0) + 1;
    });

    const bestSeller = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0] || ["-", 0];

    res.json({
      status: "success",
      result: {
        summary: {
          totalRevenue,
          totalTransactions,
          bestSeller: { name: bestSeller[0], count: bestSeller[1] },
        },
        transactions,
      },
    });
    return
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil laporan penjualan",
      error,
    });
    return
  }
};