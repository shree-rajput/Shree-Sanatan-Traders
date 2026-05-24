const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/address.controller");

router.use(auth); // All address routes are protected

router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);
router.patch("/:id/default", setDefaultAddress);

module.exports = router;
