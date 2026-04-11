const express = require("express");
const router = express.Router();
const {
  dashboard,
  getAllOrders,updateOrderStatus,getAllUsers
} = require("../controllers/admin.controller");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/dashboard", auth, isAdmin, dashboard);
router.get("/orders", auth, isAdmin, getAllOrders);
router.put("/orders/:id", auth, isAdmin, updateOrderStatus);
router.get("/users", auth, isAdmin, getAllUsers);

module.exports = router;