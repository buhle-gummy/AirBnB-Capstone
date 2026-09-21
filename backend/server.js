const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET =
  process.env.JWT_SECRET || "airbnb-capstone-secret";

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5176",
      "https://airbnb-capstone-frontend-pwvt.onrender.com",
    ],
    credentials: true,
  })
);

/* =========================================================
   BODY PARSING
========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   AUTHENTICATION
========================================================= */

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token =
    authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

/* =========================================================
   ACCOMMODATION SCHEMA
========================================================= */

const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    bedrooms: {
      type: Number,
      default: 1,
    },

    bathrooms: {
      type: Number,
      default: 1,
    },

    guests: {
      type: Number,
      default: 1,
    },

    type: {
      type: String,
      default: "Apartment",
    },

    price: {
      type: Number,
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    weeklyDiscount: {
      type: Number,
      default: 0,
    },

    cleaningFee: {
      type: Number,
      default: 0,
    },

    serviceFee: {
      type: Number,
      default: 0,
    },

    occupancyTaxes: {
      type: Number,
      default: 0,
    },

    enhancedCleaning: {
      type: Boolean,
      default: false,
    },

    selfCheckIn: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    host: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Accommodation =
  mongoose.model(
    "Accommodation",
    accommodationSchema
  );

/* =========================================================
   USER SCHEMA
========================================================= */

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

/* =========================================================
   RESERVATION SCHEMA
========================================================= */

const reservationSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    guestName: {
      type: String,
      required: true,
    },

    guestEmail: {
      type: String,
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
      ],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const Reservation =
  mongoose.model(
    "Reservation",
    reservationSchema
  );

/* =========================================================
   ROOT ROUTE
========================================================= */

app.get("/", (req, res) => {
  res.send("Airbnb Capstone API is running!");
});

/* =========================================================
   ACCOMMODATION ROUTES
========================================================= */

/* GET ALL ACCOMMODATIONS */

app.get(
  "/api/accommodations",
  async (req, res) => {
    try {
      const accommodations =
        await Accommodation.find().sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        count: accommodations.length,
        accommodations,
      });
    } catch (error) {
      console.error(
        "GET ACCOMMODATIONS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch accommodations",
      });
    }
  }
);

/* GET ONE ACCOMMODATION */

app.get(
  "/api/accommodations/:id",
  async (req, res) => {
    try {
      const accommodation =
        await Accommodation.findById(
          req.params.id
        );

      if (!accommodation) {
        return res.status(404).json({
          success: false,
          message: "Accommodation not found",
        });
      }

      res.json({
        success: true,
        accommodation,
      });
    } catch (error) {
      console.error(
        "GET ACCOMMODATION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch accommodation",
      });
    }
  }
);

/* CREATE ACCOMMODATION */

app.post(
  "/api/accommodations",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const accommodation =
        await Accommodation.create(req.body);

      res.status(201).json({
        success: true,
        accommodation,
      });
    } catch (error) {
      console.error(
        "CREATE ACCOMMODATION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create accommodation",
      });
    }
  }
);

/* UPDATE ACCOMMODATION */

app.put(
  "/api/accommodations/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const accommodation =
        await Accommodation.findByIdAndUpdate(
          req.params.id,
          req.body,
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

      res.json({
        success: true,
        accommodation,
      });
    } catch (error) {
      console.error(
        "UPDATE ACCOMMODATION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update accommodation",
      });
    }
  }
);

/* DELETE ACCOMMODATION */

app.delete(
  "/api/accommodations/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const accommodation =
        await Accommodation.findByIdAndDelete(
          req.params.id
        );

      if (!accommodation) {
        return res.status(404).json({
          success: false,
          message: "Accommodation not found",
        });
      }

      res.json({
        success: true,
        message:
          "Accommodation deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE ACCOMMODATION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete accommodation",
      });
    }
  }
);

/* =========================================================
   USER ROUTES
========================================================= */

/* REGISTER */

app.post(
  "/api/users/register",
  async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        role,
      } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Username and password are required",
        });
      }

      const existingUser =
        await User.findOne({
          $or: [
            { username },
            ...(email
              ? [{ email: email.toLowerCase() }]
              : []),
          ],
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "Username or email already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const user =
        await User.create({
          username,
          email: email
            ? email.toLowerCase()
            : undefined,
          password: hashedPassword,
          role:
            role === "admin"
              ? "admin"
              : "user",
        });

      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to register user",
      });
    }
  }
);

/* LOGIN */

app.post(
  "/api/users/login",
  async (req, res) => {
    try {
      const {
        username,
        email,
        password,
      } = req.body;

      if ((!username && !email) || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Username/email and password are required",
        });
      }

      const identifier =
        username || email;

      const user =
        await User.findOne({
          $or: [
            {
              username: identifier,
            },
            {
              email:
                identifier.toLowerCase(),
            },
          ],
        });

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid username/email or password",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid username/email or password",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Login failed",
      });
    }
  }
);

/* GET ALL USERS - ADMIN */

app.get(
  "/api/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const users =
        await User.find().select(
          "-password"
        );

      res.json({
        success: true,
        users,
      });
    } catch (error) {
      console.error(
        "GET USERS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch users",
      });
    }
  }
);

/* UPDATE USER ROLE - ADMIN */

app.patch(
  "/api/users/:id/role",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (
        !["user", "admin"].includes(role)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          { role },
          {
            new: true,
          }
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error(
        "UPDATE USER ROLE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update user role",
      });
    }
  }
);

/* DELETE USER - ADMIN */

app.delete(
  "/api/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const user =
        await User.findByIdAndDelete(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message:
          "User deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete user",
      });
    }
  }
);

/* =========================================================
   RESERVATION ROUTES
========================================================= */

/* GET RESERVATIONS */

app.get(
  "/api/reservations",
  async (req, res) => {
    try {
      const reservations =
        await Reservation.find()
          .populate("accommodation")
          .populate("user", "-password")
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        reservations,
      });
    } catch (error) {
      console.error(
        "GET RESERVATIONS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch reservations",
      });
    }
  }
);

/* =========================================================
   CREATE RESERVATION
========================================================= */

app.post(
  "/api/reservations",
  authenticateToken,
  async (req, res) => {
    try {
      console.log(
        "\n=============================="
      );
      console.log(
        "CREATE RESERVATION REQUEST"
      );
      console.log(
        "REQUEST BODY:",
        req.body
      );
      console.log(
        "LOGGED IN USER:",
        req.user
      );
      console.log(
        "==============================\n"
      );

      const {
        accommodation,
        checkIn,
        checkOut,
        guests,
        guestName,
        guestEmail,
      } = req.body;

      /* -----------------------------------------
         VALIDATE REQUIRED BOOKING DATA
      ----------------------------------------- */

      if (!accommodation) {
        return res.status(400).json({
          success: false,
          message:
            "Accommodation is required",
        });
      }

      if (!checkIn) {
        return res.status(400).json({
          success: false,
          message:
            "Check-in date is required",
        });
      }

      if (!checkOut) {
        return res.status(400).json({
          success: false,
          message:
            "Check-out date is required",
        });
      }

      if (!guests) {
        return res.status(400).json({
          success: false,
          message:
            "Number of guests is required",
        });
      }

      /* -----------------------------------------
         FIND ACCOMMODATION
      ----------------------------------------- */

      if (
        !mongoose.Types.ObjectId.isValid(
          accommodation
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid accommodation ID",
        });
      }

      const accommodationRecord =
        await Accommodation.findById(
          accommodation
        );

      if (!accommodationRecord) {
        return res.status(404).json({
          success: false,
          message:
            "Accommodation not found",
        });
      }

      /* -----------------------------------------
         VALIDATE DATES
      ----------------------------------------- */

      const startDate =
        new Date(checkIn);

      const endDate =
        new Date(checkOut);

      if (
        Number.isNaN(
          startDate.getTime()
        ) ||
        Number.isNaN(
          endDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid check-in or check-out date",
        });
      }

      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message:
            "Check-out date must be after check-in date",
        });
      }

      /* -----------------------------------------
         VALIDATE GUEST COUNT
      ----------------------------------------- */

      const guestCount =
        Number(guests);

      if (
        !Number.isInteger(
          guestCount
        ) ||
        guestCount < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Guests must be a valid number",
        });
      }

      if (
        accommodationRecord.guests &&
        guestCount >
          accommodationRecord.guests
      ) {
        return res.status(400).json({
          success: false,
          message: `This accommodation allows a maximum of ${accommodationRecord.guests} guests`,
        });
      }

      /* -----------------------------------------
         GET LOGGED-IN USER
      ----------------------------------------- */

      let currentUser = null;

      if (req.user && req.user.id) {
        currentUser =
          await User.findById(
            req.user.id
          );
      }

      /* -----------------------------------------
         GUEST NAME
      ----------------------------------------- */

      const finalGuestName =
        guestName ||
        currentUser?.username ||
        req.user?.username ||
        "Guest";

      /* -----------------------------------------
         GUEST EMAIL
      ----------------------------------------- */

      const finalGuestEmail =
        guestEmail ||
        currentUser?.email ||
        "";

      if (!finalGuestEmail) {
        return res.status(400).json({
          success: false,
          message:
            "Guest email is required. Please make sure your account has an email address.",
        });
      }

      /* -----------------------------------------
         CALCULATE NUMBER OF NIGHTS
      ----------------------------------------- */

      const millisecondsPerNight =
        1000 *
        60 *
        60 *
        24;

      const nights = Math.ceil(
        (endDate - startDate) /
          millisecondsPerNight
      );

      if (nights < 1) {
        return res.status(400).json({
          success: false,
          message:
            "Booking must be at least one night",
        });
      }

      /* -----------------------------------------
         CALCULATE PRICE
      ----------------------------------------- */

      const nightlyPrice =
        Number(
          accommodationRecord.price
        ) || 0;

      const cleaningFee =
        Number(
          accommodationRecord.cleaningFee
        ) || 0;

      const serviceFee =
        Number(
          accommodationRecord.serviceFee
        ) || 0;

      const occupancyTaxes =
        Number(
          accommodationRecord.occupancyTaxes
        ) || 0;

      const weeklyDiscount =
        Number(
          accommodationRecord.weeklyDiscount
        ) || 0;

      const basePrice =
        nightlyPrice * nights;

      let discount = 0;

      /*
        weeklyDiscount is treated as a percentage.
        Example:
        10 = 10% discount.
      */

      if (
        nights >= 7 &&
        weeklyDiscount > 0
      ) {
        discount =
          basePrice *
          (weeklyDiscount / 100);
      }

      const subtotal =
        basePrice - discount;

      const totalPrice =
        subtotal +
        cleaningFee +
        serviceFee +
        occupancyTaxes;

      if (
        !Number.isFinite(
          totalPrice
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Unable to calculate reservation price",
        });
      }

      /* -----------------------------------------
         CREATE RESERVATION
      ----------------------------------------- */

      const reservation =
        await Reservation.create({
          accommodation:
            accommodationRecord._id,

          user:
            currentUser?._id ||
            req.user?.id ||
            null,

          guestName:
            finalGuestName,

          guestEmail:
            finalGuestEmail,

          checkIn:
            startDate,

          checkOut:
            endDate,

          guests:
            guestCount,

          totalPrice:
            Number(
              totalPrice.toFixed(2)
            ),

          status:
            "confirmed",
        });

      /* -----------------------------------------
         POPULATE RESERVATION
      ----------------------------------------- */

      const populatedReservation =
        await Reservation.findById(
          reservation._id
        )
          .populate(
            "accommodation"
          )
          .populate(
            "user",
            "-password"
          );

      console.log(
        "RESERVATION CREATED:",
        reservation._id
      );

      console.log(
        "GUEST:",
        finalGuestName
      );

      console.log(
        "EMAIL:",
        finalGuestEmail
      );

      console.log(
        "NIGHTS:",
        nights
      );

      console.log(
        "TOTAL:",
        totalPrice
      );

      /* -----------------------------------------
         SUCCESS RESPONSE
      ----------------------------------------- */

      res.status(201).json({
        success: true,
        message:
          "Reservation created successfully",
        reservation:
          populatedReservation,
      });
    } catch (error) {
      console.error(
        "\nCREATE RESERVATION ERROR:",
        error
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Reservation validation failed",
          errors: Object.values(
            error.errors
          ).map(
            (item) => item.message
          ),
        });
      }

      if (
        error.name ===
        "CastError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid reservation data",
          error:
            error.message,
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to create reservation",
        error:
          error.message,
      });
    }
  }
);

/* =========================================================
   UPDATE RESERVATION STATUS - ADMIN
========================================================= */

app.patch(
  "/api/reservations/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (
        ![
          "pending",
          "confirmed",
          "cancelled",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid reservation status",
        });
      }

      const reservation =
        await Reservation.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
          }
        );

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Reservation not found",
        });
      }

      res.json({
        success: true,
        reservation,
      });
    } catch (error) {
      console.error(
        "UPDATE RESERVATION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update reservation",
      });
    }
  }
);

/* =========================================================
   DELETE RESERVATION - ADMIN
========================================================= */

app.delete(
  "/api/reservations/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const reservation =
        await Reservation.findByIdAndDelete(
          req.params.id
        );

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message:
            "Reservation not found",
        });
      }

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
      });
    }
  }
);

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
  (err, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  }
);

/* =========================================================
   START SERVER
========================================================= */

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in .env"
      );
    }

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

startServer();