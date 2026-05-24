const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/coupon.controller");

router.get("/", auth, isAdmin, controller.listCoupons);
router.post("/", auth, isAdmin, controller.createCoupon);
router.patch("/:id", auth, isAdmin, controller.updateCoupon);

module.exports = router;
