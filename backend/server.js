const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

/* =========================
   ENVIRONMENT
========================= */

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "airbnb-capstone-secret";

const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // During deployment, allow configured origins.
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS: Origin not allowed")
      );
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

/* =========================
   DATABASE SCHEMAS
========================= */

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
      default: 2,
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
      default: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    host: {
      type: String,
      default: "Airbnb Host",
    },
  },
  {
    timestamps: true,
  }
);

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
      trim: true,
      lowercase: true,
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
      default: "",
    },

    guestEmail: {
      type: String,
      default: "",
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
      default: 1,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const Accommodation =
  mongoose.models.Accommodation ||
  mongoose.model("Accommodation", accommodationSchema);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Airbnb Capstone API is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

/* =========================
   ACCOMMODATIONS
========================= */

// GET ALL
app.get("/api/accommodations", async (req, res) => {
  try {
    const accommodations = await Accommodation.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: accommodations.length,
      accommodations,
    });
  } catch (error) {
    console.error("GET accommodations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load accommodations",
      error: error.message,
    });
  }
});

// GET ONE
app.get("/api/accommodations/:id", async (req, res) => {
  try {
    const accommodation =
      await Accommodation.findById(req.params.id);

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
    console.error("GET accommodation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load accommodation",
      error: error.message,
    });
  }
});

// CREATE (Admin only)
app.post("/api/accommodations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const accommodation =
      await Accommodation.create(req.body);

    res.status(201).json({
      success: true,
      message: "Accommodation created successfully",
      accommodation,
    });
  } catch (error) {
    console.error("CREATE accommodation error:", error);

    res.status(400).json({
      success: false,
      message: "Unable to create accommodation",
      error: error.message,
    });
  }
});

// UPDATE (Admin only)
app.put("/api/accommodations/:id", authenticateToken, requireAdmin, async (req, res) => {
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
      message: "Accommodation updated successfully",
      accommodation,
    });
  } catch (error) {
    console.error("UPDATE accommodation error:", error);

    res.status(400).json({
      success: false,
      message: "Unable to update accommodation",
      error: error.message,
    });
  }
});

// DELETE (Admin only)
app.delete("/api/accommodations/:id", authenticateToken, requireAdmin, async (req, res) => {
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
      message: "Accommodation deleted successfully",
    });
  } catch (error) {
    console.error("DELETE accommodation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete accommodation",
      error: error.message,
    });
  }
});

/* =========================
   USER REGISTRATION
========================= */

app.post("/api/users/register", async (req, res) => {
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
        message: "Username and password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { username },
        ...(email ? [{ email }] : []),
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
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
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to register user",
      error: error.message,
    });
  }
});

/* =========================
   USER LOGIN
========================= */

app.post("/api/users/login", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const loginValue = username || email;

    if (!loginValue || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        { username: loginValue },
        { email: loginValue.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
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
        message: "Invalid username or password",
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
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to login",
      error: error.message,
    });
  }
});

/* =========================
   USER MANAGEMENT (ADMIN)
========================= */

// GET ALL USERS (Admin only)
app.get("/api/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET users error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load users",
      error: error.message,
    });
  }
});

// UPDATE USER ROLE (Admin only)
app.patch("/api/users/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE user role error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update user role",
      error: error.message,
    });
  }
});

// DELETE USER (Admin only)
app.delete("/api/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE user error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete user",
      error: error.message,
    });
  }
});

/* =========================
   RESERVATIONS
========================= */

app.get("/api/reservations", async (req, res) => {
  try {
    const reservations =
      await Reservation.find()
        .populate("accommodation")
        .populate("user")
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("GET reservations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load reservations",
      error: error.message,
    });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const reservation =
      await Reservation.create(req.body);

    const populatedReservation =
      await Reservation.findById(
        reservation._id
      ).populate("accommodation");

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation: populatedReservation,
    });
  } catch (error) {
    console.error("CREATE reservation error:", error);

    res.status(400).json({
      success: false,
      message: "Unable to create reservation",
      error: error.message,
    });
  }
});

// UPDATE RESERVATION STATUS (Admin only)
app.patch("/api/reservations/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("accommodation");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.json({
      success: true,
      message: "Reservation status updated successfully",
      reservation,
    });
  } catch (error) {
    console.error("UPDATE reservation status error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update reservation status",
      error: error.message,
    });
  }
});

// DELETE RESERVATION (Admin only)
app.delete("/api/reservations/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("DELETE reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete reservation",
      error: error.message,
    });
  }
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* =========================
   START SERVER
========================= */

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Add MONGO_URI to the Render Environment Variables."
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Airbnb Capstone API running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "SERVER STARTUP FAILED:",
      error.message
    );

    process.exit(1);
  }
}

startServer();