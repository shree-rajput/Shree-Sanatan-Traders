const express = require("express");
const router = express.Router();

const { createCategory, getCategories,updateCategory,deleteCategory } = require("../controllers/category.controller");
const auth = require("../middleware/auth");

// optional: admin middleware
const isAdmin = require("../middleware/isAdmin");

router.post("/", auth, createCategory); 
router.get("/", getCategories);
router.put("/:id", auth, isAdmin, updateCategory);
router.delete("/:id", auth, isAdmin, deleteCategory);

module.exports = router;