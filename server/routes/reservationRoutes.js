const express = require("express");

const {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  updateReservationStatus,
  getUserReservations,
  getHostReservations,
  deleteReservation,
} = require("../controllers/reservationController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

// Create reservation - logged-in users only
router.post("/", protect, createReservation);

// Get all reservations - logged-in users
router.get("/", protect, getReservations);

// Rubric-specific filtered reservation endpoints
router.get("/user", protect, getUserReservations);
router.get("/host", protect, getHostReservations);

// Get one reservation - logged-in users
router.get("/:id", protect, getReservationById);

// Update reservation - owner or admin
router.put("/:id", protect, updateReservation);

// Update reservation status - Admin only
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateReservationStatus
);

// Delete reservation - owner or admin
router.delete("/:id", protect, deleteReservation);

module.exports = router;
