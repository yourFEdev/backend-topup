import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { Voucher } from "../models/Voucher";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [revenue, transactions, vouchers, customers] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            payment_status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$price",
            },
          },
        },
      ]),

      Transaction.countDocuments({
        status: "success",
      }),

      Voucher.countDocuments(),

      User.countDocuments({
        role: "customer",
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        revenue: revenue[0]?.total ?? 0,
        transactions,
        vouchers,
        customers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};

export const getRevenue = async (req: Request, res: Response) => {
  try {
    const range = (req.query.range as string) || "6m";

    let startDate = new Date();
    let groupBy: any;

    switch (range) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);

        groupBy = {
          day: {
            $dayOfMonth: "$createdAt",
          },
        };
        break;

      case "30d":
        startDate.setDate(startDate.getDate() - 30);

        groupBy = {
          day: {
            $dayOfMonth: "$createdAt",
          },
        };
        break;

      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);

        groupBy = {
          month: {
            $month: "$createdAt",
          },
        };
        break;

      default:
        startDate.setMonth(startDate.getMonth() - 6);

        groupBy = {
          month: {
            $month: "$createdAt",
          },
        };
    }

    const revenue = await Transaction.aggregate([
      {
        $match: {
          status: "success",
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$variant.price",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue chart.",
    });
  }
};
