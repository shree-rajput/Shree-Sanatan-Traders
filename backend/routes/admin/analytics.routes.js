const express = require("express");
const router = express.Router();
const AIAnalyticsService = require("../../services/aiAnalytics.service");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/analytics.controller");

router.get("/", auth, isAdmin, controller.getAnalytics);

/**
 * @route   GET /api/admin/analytics/forecast
 * @desc    Get demand forecasting for products
 */
router.get("/forecast", auth, isAdmin, async (req, res) => {
  try {
    const { historyDays, forecastDays } = req.query;
    const forecast = await AIAnalyticsService.getDemandForecast(
      historyDays ? parseInt(historyDays) : 30,
      forecastDays ? parseInt(forecastDays) : 30
    );
    res.json({ success: true, data: forecast });
  } catch (error) {
    console.error("Error in /forecast route:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

/**
 * @route   GET /api/admin/analytics/reorder-suggestions
 * @desc    Get auto reorder suggestions for low stock items
 */
router.get("/reorder-suggestions", auth, isAdmin, async (req, res) => {
  try {
    const suggestions = await AIAnalyticsService.getReorderSuggestions(7, 5); // Default 7 days lead time, 5 safety stock
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error("Error in /reorder-suggestions route:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

/**
 * @route   GET /api/admin/analytics/sales-trends
 * @desc    Get sales trend analysis
 */
router.get("/sales-trends", auth, isAdmin, async (req, res) => {
  try {
    const trends = await AIAnalyticsService.getSalesTrends();
    res.json({ success: true, data: trends });
  } catch (error) {
    console.error("Error in /sales-trends route:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;
