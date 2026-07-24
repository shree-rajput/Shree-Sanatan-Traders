const mongoose = require("mongoose");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");

// AI Analytics Service
class AIAnalyticsService {
  /**
   * Generates a demand forecast for products based on past sales history.
   * Uses a simple moving average / statistical approach.
   * @param {number} daysHistory - Number of days of historical data to look at.
   * @param {number} daysForecast - Number of days to forecast ahead.
   */
  static async getDemandForecast(daysHistory = 30, daysForecast = 30) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysHistory);

    // Aggregate total quantity sold per product in the historical period
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: pastDate },
          orderStatus: { $nin: ["cancelled", "returned"] },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantitySold: { $sum: "$items.quantity" },
          productName: { $first: "$items.name" },
        },
      },
      {
        $project: {
          productId: "$_id",
          productName: 1,
          totalQuantitySold: 1,
          dailyAverage: { $divide: ["$totalQuantitySold", daysHistory] },
          _id: 0,
        },
      },
      { $sort: { totalQuantitySold: -1 } },
    ]);

    // Calculate forecast
    const forecast = salesData.map((item) => ({
      ...item,
      forecastedDemand: Math.ceil(item.dailyAverage * daysForecast),
      confidenceScore: "High", // Simplified confidence
    }));

    return forecast;
  }

  /**
   * Generates reorder suggestions for products.
   * Formula: Reorder Point = (Daily Average Sales * Lead Time) + Safety Stock
   * If current stock <= Reorder Point, suggest a reorder.
   */
  static async getReorderSuggestions(leadTimeDays = 7, safetyStock = 5) {
    // Look at last 30 days to determine daily average sales
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);

    const salesVelocity = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: pastDate },
          orderStatus: { $nin: ["cancelled", "returned"] },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantitySold: { $sum: "$items.quantity" },
        },
      },
    ]);

    const velocityMap = {};
    salesVelocity.forEach((item) => {
      velocityMap[item._id] = item.totalQuantitySold / 30; // daily average
    });

    const products = await Product.find({ status: "active" });

    const suggestions = [];

    for (let product of products) {
      const dailySales = velocityMap[product._id] || 0.1; // fallback to 0.1 for slow movers
      const reorderPoint = Math.ceil(dailySales * leadTimeDays) + safetyStock;

      if (product.stock <= reorderPoint) {
        suggestions.push({
          productId: product._id,
          name: product.name,
          currentStock: product.stock,
          reorderPoint,
          dailySales: Number(dailySales.toFixed(2)),
          suggestedReorderQuantity: Math.max(reorderPoint * 2, 10), // Example heuristic: order 2x reorder point or at least 10
          supplier: product.supplier || "Unknown",
        });
      }
    }

    return suggestions.sort((a, b) => a.currentStock - b.currentStock);
  }

  /**
   * Analyzes sales trends, comparing current month to previous month.
   */
  static async getSalesTrends() {
    const now = new Date();
    
    // Current month start
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Previous month start
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentMonthSales, prevMonthSales] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfCurrentMonth },
            orderStatus: { $nin: ["cancelled", "returned"] },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth },
            orderStatus: { $nin: ["cancelled", "returned"] },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
    ]);

    const current = currentMonthSales[0] || { totalRevenue: 0, totalOrders: 0 };
    const previous = prevMonthSales[0] || { totalRevenue: 0, totalOrders: 0 };

    let revenueGrowth = 0;
    if (previous.totalRevenue > 0) {
      revenueGrowth = ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100;
    } else if (current.totalRevenue > 0) {
      revenueGrowth = 100; // infinite growth from 0
    }

    return {
      currentMonth: current,
      previousMonth: previous,
      revenueGrowthPercentage: Number(revenueGrowth.toFixed(2)),
      trendIndicator: revenueGrowth >= 0 ? "UP" : "DOWN",
    };
  }
}

module.exports = AIAnalyticsService;
