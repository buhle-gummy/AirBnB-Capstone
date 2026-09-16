const express = require("express");

const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodationController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

// Create accommodation - Admin only
router.post("/", protect, adminOnly, createAccommodation);

// Get all accommodations - Public
router.get("/", getAccommodations);

// Get one accommodation - Public
router.get("/:id", getAccommodationById);

// Update accommodation - Admin only
router.put("/:id", protect, adminOnly, updateAccommodation);

// Delete accommodation - Admin only
router.delete("/:id", protect, adminOnly, deleteAccommodation);

module.exports = router;