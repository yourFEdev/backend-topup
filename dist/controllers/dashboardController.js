"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenue = exports.getStats = void 0;
const Transaction_1 = require("../models/Transaction");
const User_1 = require("../models/User");
const Voucher_1 = require("../models/Voucher");
const getStats = async (_req, res) => {
    try {
        const [revenue, transactions, vouchers, customers] = await Promise.all([
            Transaction_1.Transaction.aggregate([
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
            Transaction_1.Transaction.countDocuments({
                status: "success",
            }),
            Voucher_1.Voucher.countDocuments(),
            User_1.User.countDocuments({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics.",
        });
    }
};
exports.getStats = getStats;
const getRevenue = async (req, res) => {
    try {
        const range = req.query.range || "6m";
        let startDate = new Date();
        let groupBy;
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
        const revenue = await Transaction_1.Transaction.aggregate([
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch revenue chart.",
        });
    }
};
exports.getRevenue = getRevenue;
