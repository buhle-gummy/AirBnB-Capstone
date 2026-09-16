const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

const calculateTotal = (accommodation, checkIn, checkOut) => {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
  const subtotal = nights * Number(accommodation.price || 0);
  const discount = nights >= 7 ? Math.round((subtotal * Number(accommodation.weeklyDiscount || 0)) / 100) : 0;
  const serviceFee = Math.round(((subtotal - discount) * Number(accommodation.serviceFee || 0)) / 100);
  const taxes = Math.round(((subtotal - discount) * Number(accommodation.occupancyTaxes || 0)) / 100);
  return subtotal - discount + Number(accommodation.cleaningFee || 0) + serviceFee + taxes;
};

// Create a reservation
const createReservation = async (req, res) => {
  try {
    const {
      accommodation,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    // Validate required fields
    if (
      !accommodation ||
      !checkIn ||
      !checkOut ||
      !guests
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Accommodation, check-in date, check-out date and guests are required",
      });
    }

    // Validate dates
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Validate guests
    if (guests < 1) {
      return res.status(400).json({
        success: false,
        message: "At least 1 guest is required",
      });
    }

    const accommodationRecord = await Accommodation.findById(accommodation);
    if (!accommodationRecord) {
      return res.status(404).json({ success: false, message: "Accommodation not found" });
    }
    if (Number(guests) > accommodationRecord.guests) {
      return res.status(400).json({ success: false, message: `This accommodation allows up to ${accommodationRecord.guests} guests` });
    }

    const calculatedTotal = calculateTotal(accommodationRecord, checkIn, checkOut);

    const reservation = await Reservation.create({
      user: req.user.id,
      accommodation,
      checkIn,
      checkOut,
      guests,
      totalPrice: calculatedTotal,
    });

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create reservation",
      error: error.message,
    });
  }
};


// Get all reservations
const getReservations = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user.id };
    const reservations = await Reservation.find(query)
      .populate("user", "username email")
      .populate("accommodation", "title location price");

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reservations",
      error: error.message,
    });
  }
};


// Get one reservation
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user", "username email")
      .populate("accommodation", "title location price");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this reservation",
      });
    }

    res.status(200).json({
      success: true,
      reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid reservation ID",
      error: error.message,
    });
  }
};


// Update a reservation
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Only the reservation owner or an admin can update it
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this reservation",
      });
    }

    // Validate dates if they are being updated
    const checkIn = req.body.checkIn || reservation.checkIn;
    const checkOut = req.body.checkOut || reservation.checkOut;

    if (Number.isNaN(new Date(checkIn).getTime()) || Number.isNaN(new Date(checkOut).getTime()) || new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Validate guests if provided
    if (
      req.body.guests !== undefined &&
      req.body.guests < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "At least 1 guest is required",
      });
    }

    // Validate total price if provided
    if (
      req.body.totalPrice !== undefined &&
      req.body.totalPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Total price cannot be negative",
      });
    }

    const allowedUpdates = {};
    for (const field of ["checkIn", "checkOut", "guests"]) {
      if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    }
    Object.assign(reservation, allowedUpdates);

    const accommodationRecord = await Accommodation.findById(reservation.accommodation);
    if (!accommodationRecord) {
      return res.status(404).json({ success: false, message: "Accommodation not found" });
    }
    if (Number(reservation.guests) > accommodationRecord.guests) {
      return res.status(400).json({ success: false, message: `This accommodation allows up to ${accommodationRecord.guests} guests` });
    }
    reservation.totalPrice = calculateTotal(accommodationRecord, reservation.checkIn, reservation.checkOut);

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update reservation",
      error: error.message,
    });
  }
};


// Update reservation status - Admin only
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Status must be pending, confirmed, cancelled, or completed",
      });
    }

    // Find reservation
    const reservation = await Reservation.findById(
      req.params.id
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Update status
    reservation.status = status;

    await reservation.save();

    // Get updated reservation with user and accommodation
    const updatedReservation =
      await Reservation.findById(reservation._id)
        .populate("user", "username email")
        .populate(
          "accommodation",
          "title location price"
        );

    res.status(200).json({
      success: true,
      message:
        "Reservation status updated successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        "Failed to update reservation status",
      error: error.message,
    });
  }
};


const getUserReservations = async (req, res) => {
  return getReservations(req, res);
};

const getHostReservations = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "host") {
    return res.status(403).json({ success: false, message: "Host access required" });
  }
  try {
    const properties = req.user.role === "admin" ? [] : await Accommodation.find({ hostId: req.user.id }).select("_id");
    const query = req.user.role === "admin" ? {} : { accommodation: { $in: properties.map((property) => property._id) } };
    const reservations = await Reservation.find(query).populate("user", "username email").populate("accommodation", "title location price");
    return res.status(200).json({ success: true, count: reservations.length, reservations });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch host reservations" });
  }
};

// Delete/cancel a reservation
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Only the reservation owner or an admin can delete it
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this reservation",
      });
    }

    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        "Failed to delete reservation",
      error: error.message,
    });
  }
};


module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  updateReservationStatus,
  getUserReservations,
  getHostReservations,
  deleteReservation,
};
