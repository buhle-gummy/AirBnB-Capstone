const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

// Calculate reservation total
const calculateTotal = (accommodation, checkIn, checkOut) => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.ceil(
    (endDate - startDate) / millisecondsPerDay
  );

  const numberOfNights = Math.max(nights, 1);

  const pricePerNight = Number(accommodation.price) || 0;
  const cleaningFee = Number(accommodation.cleaningFee) || 0;
  const serviceFee = Number(accommodation.serviceFee) || 0;
  const occupancyTaxes = Number(accommodation.occupancyTaxes) || 0;

  const weeklyDiscount =
    Number(accommodation.weeklyDiscount) || 0;

  let accommodationTotal =
    pricePerNight * numberOfNights;

  // Apply weekly discount when applicable
  if (numberOfNights >= 7 && weeklyDiscount > 0) {
    accommodationTotal =
      accommodationTotal -
      (accommodationTotal * weeklyDiscount) / 100;
  }

  return (
    accommodationTotal +
    cleaningFee +
    serviceFee +
    occupancyTaxes
  );
};

// CREATE RESERVATION
const createReservation = async (req, res) => {
  try {
    console.log("====================================");
    console.log("CREATE RESERVATION REQUEST");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("====================================");

    const {
      accommodation,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
    } = req.body;

    // Validate required booking fields
    if (!accommodation || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message:
          "Accommodation, check-in date, check-out date and guests are required",
      });
    }

    // Find accommodation
    const accommodationRecord =
      await Accommodation.findById(accommodation);

    if (!accommodationRecord) {
      return res.status(404).json({
        success: false,
        message: "Accommodation not found",
      });
    }

    // Validate dates
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date",
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Validate guests
    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "At least 1 guest is required",
      });
    }

    if (
      accommodationRecord.guests &&
      guestCount > Number(accommodationRecord.guests)
    ) {
      return res.status(400).json({
        success: false,
        message: `This accommodation allows up to ${accommodationRecord.guests} guests`,
      });
    }

    // Get guest information
    const finalGuestName =
      guestName ||
      req.user?.name ||
      req.user?.username ||
      "Guest";

    const finalGuestEmail =
      guestEmail ||
      req.user?.email ||
      "";

    if (!finalGuestEmail) {
      return res.status(400).json({
        success: false,
        message: "Guest email is required",
      });
    }

    // Calculate total price
    const calculatedTotal = calculateTotal(
      accommodationRecord,
      checkIn,
      checkOut
    );

    console.log("CALCULATED TOTAL:", calculatedTotal);
    console.log("GUEST NAME:", finalGuestName);
    console.log("GUEST EMAIL:", finalGuestEmail);

    // Create reservation
    const reservation = await Reservation.create({
      user: req.user.id,
      accommodation: accommodationRecord._id,

      checkIn: startDate,
      checkOut: endDate,

      guests: guestCount,

      guestName: finalGuestName,
      guestEmail: finalGuestEmail,

      totalPrice: calculatedTotal,
    });

    console.log(
      "RESERVATION CREATED:",
      reservation._id
    );

    return res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error(
      "CREATE RESERVATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create reservation",
      error: error.message,
    });
  }
};

// GET ALL RESERVATIONS
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("accommodation");

    res.json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error("GET RESERVATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reservations",
      error: error.message,
    });
  }
};

// GET RESERVATION BY ID
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(
      req.params.id
    )
      .populate("user", "name email")
      .populate("accommodation");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.error(
      "GET RESERVATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch reservation",
      error: error.message,
    });
  }
};

// GET USER RESERVATIONS
const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user.id,
    })
      .populate("accommodation")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error(
      "GET USER RESERVATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user reservations",
      error: error.message,
    });
  }
};

// GET HOST RESERVATIONS
const getHostReservations = async (req, res) => {
  try {
    const accommodations =
      await Accommodation.find({
        host: req.user.id,
      }).select("_id");

    const accommodationIds =
      accommodations.map(
        (item) => item._id
      );

    const reservations =
      await Reservation.find({
        accommodation: {
          $in: accommodationIds,
        },
      })
        .populate("user", "name email")
        .populate("accommodation")
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error(
      "GET HOST RESERVATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch host reservations",
      error: error.message,
    });
  }
};

// UPDATE RESERVATION
const updateReservation = async (req, res) => {
  try {
    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (
      reservation.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this reservation",
      });
    }

    const {
      checkIn,
      checkOut,
      guests,
    } = req.body;

    if (checkIn) {
      reservation.checkIn = new Date(
        checkIn
      );
    }

    if (checkOut) {
      reservation.checkOut = new Date(
        checkOut
      );
    }

    if (guests) {
      reservation.guests = Number(guests);
    }

    // Recalculate total if dates changed
    if (checkIn || checkOut) {
      const accommodation =
        await Accommodation.findById(
          reservation.accommodation
        );

      if (accommodation) {
        reservation.totalPrice =
          calculateTotal(
            accommodation,
            reservation.checkIn,
            reservation.checkOut
          );
      }
    }

    await reservation.save();

    res.json({
      success: true,
      message: "Reservation updated successfully",
      reservation,
    });
  } catch (error) {
    console.error(
      "UPDATE RESERVATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update reservation",
      error: error.message,
    });
  }
};

// UPDATE RESERVATION STATUS
const updateReservationStatus = async (
  req,
  res
) => {
  try {
    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    const { status } = req.body;

    reservation.status = status;

    await reservation.save();

    res.json({
      success: true,
      message:
        "Reservation status updated successfully",
      reservation,
    });
  } catch (error) {
    console.error(
      "UPDATE STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update reservation status",
      error: error.message,
    });
  }
};

// DELETE RESERVATION
const deleteReservation = async (
  req,
  res
) => {
  try {
    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (
      reservation.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this reservation",
      });
    }

    await reservation.deleteOne();

    res.json({
      success: true,
      message:
        "Reservation deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE RESERVATION ERROR:",
      error
    );

    res.status(500).json({
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