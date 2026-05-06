const express = require("express");
const router = express.Router();
const {
  dashboard,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  createOrder
} = require("../controllers/admin.controller");

const {
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require("../controllers/supplier.controller");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Dashboard & Stats
router.get("/dashboard", auth, isAdmin, dashboard);

// POS & Billing
router.post("/orders", auth, isAdmin, createOrder);
router.get("/orders", auth, isAdmin, getAllOrders);
router.put("/orders/:id", auth, isAdmin, updateOrderStatus);

// User Management
router.get("/users", auth, isAdmin, getAllUsers);

// Product Management
router.post("/products", auth, isAdmin, createProduct);
router.put("/products/:id", auth, isAdmin, updateProduct);
router.delete("/products/:id", auth, isAdmin, deleteProduct);

// Supplier Management
router.get("/suppliers", auth, isAdmin, getAllSuppliers);
router.post("/suppliers", auth, isAdmin, createSupplier);
router.put("/suppliers/:id", auth, isAdmin, updateSupplier);
router.delete("/suppliers/:id", auth, isAdmin, deleteSupplier);

module.exports = router;