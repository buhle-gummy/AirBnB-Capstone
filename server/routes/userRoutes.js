const express = require("express");

const {
  registerUser,
  loginUser,
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

// Register - Public
router.post("/register", registerUser);

// Login - Public
router.post("/login", loginUser);

// Get all users - Admin only
router.get("/", protect, adminOnly, getUsers);

// Update user role - Admin only
router.patch("/:id/role", protect, adminOnly, updateUserRole);

// Delete user - Admin only
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;