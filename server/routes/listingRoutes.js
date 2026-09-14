const express = require("express");

const router = express.Router();

// Get all listings
router.get("/", (req, res) => {
  res.json({
    message: "Listings endpoint is working!"
  });
});

module.exports = router;