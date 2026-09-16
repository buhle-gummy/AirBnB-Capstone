const Accommodation = require("../models/Accommodation");

const editableFields = [
  "title", "location", "description", "bedrooms", "bathrooms", "guests",
  "type", "price", "amenities", "images", "weeklyDiscount", "cleaningFee",
  "serviceFee", "occupancyTaxes", "enhancedCleaning", "selfCheckIn", "rating", "reviews", "host",
];

const pickEditableFields = (payload = {}) =>
  editableFields.reduce((result, field) => {
    if (payload[field] !== undefined) result[field] = payload[field];
    return result;
  }, {});

// Create an accommodation
const createAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.create({
      ...pickEditableFields(req.body),
      hostId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Accommodation created successfully",
      accommodation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create accommodation",
      error: error.message,
    });
  }
};

// Get all accommodations
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: accommodations.length,
      accommodations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch accommodations",
      error: error.message,
    });
  }
};

// Get one accommodation
const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      });
    }

    res.status(200).json({
      success: true,
      accommodation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid accommodation ID",
      error: error.message,
    });
  }
};

// Update an accommodation
const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      pickEditableFields(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Accommodation updated successfully",
      accommodation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update accommodation",
      error: error.message,
    });
  }
};

// Delete an accommodation
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(
      req.params.id
    );

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Accommodation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete accommodation",
      error: error.message,
    });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};
