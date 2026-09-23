const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// CONNECT MONGODB
// ==========================================

connectDB();

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",

  "https://student-resources-hub-live-y438.vercel.app",

  "https://student-resources-hub-live-y438-puhj1vkih-student-resource-hub1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // Example: Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Exact allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log(
        "❌ CORS BLOCKED ORIGIN:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  return res.status(200).send(
    "🚀 Student Resources Hub Backend Running"
  );
});

// ==========================================
// API TEST
// ==========================================

app.get("/api/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Student Resources Hub API is working",
  });
});

app.use(
  "/api/admin/analytics",
  analyticsRoutes
);

// ==========================================
// AUTH ROUTES
// ==========================================
//
// POST /api/auth/register
// POST /api/auth/login
//
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

// ==========================================
// RESOURCE DELETE TEST
// ==========================================
//
// Development test route.
//
// IMPORTANT:
// This route is placed BEFORE resourceRoutes
// so it can be tested independently.
//
// DELETE /api/resources/test-delete
//
// ==========================================

app.delete(
  "/api/resources/test-delete",
  (req, res) => {
    console.log(
      "================================="
    );

    console.log(
      "DELETE TEST ROUTE HIT"
    );

    console.log(
      "================================="
    );

    return res.status(200).json({
      success: true,
      message: "DELETE route is working",
    });
  }
);

// ==========================================
// RESOURCE ROUTES
// ==========================================
//
// GET    /api/resources
// GET    /api/resources/category/Notes
// GET    /api/resources/category/PYQ
// GET    /api/resources/category/Syllabus
// GET    /api/resources/category/Ebooks
//
// GET    /api/resources/semester/:semester
//
// GET    /api/resources/branch/:branch
//
// GET    /api/resources/branch/:branch/category/:category
//
// GET    /api/resources/search/:keyword
//
// DELETE /api/resources/:id
//
// ==========================================

app.use(
  "/api/resources",
  resourceRoutes
);

app.use(
  "/api/bookmarks",
  bookmarkRoutes
);

app.use("/api/notifications", notificationRoutes);

// ==========================================
// UPLOAD ROUTES
// ==========================================
//
// POST /api/upload
//
// Admin only
// PDF upload
// Cloudinary upload
//
// ==========================================

app.use(
  "/api/upload",
  uploadRoutes
);

// ==========================================
// AI QUESTION PAPER ROUTES
// ==========================================
//
// POST /api/ai/generate-paper
//
// ==========================================

app.use(
  "/api/ai",
  aiRoutes
);

// ==========================================
// STATIC LOCAL UPLOADS
// ==========================================
//
// Local files can be accessed using:
//
// /uploads/filename.pdf
//
// Cloudinary files use Cloudinary URL.
//
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
  (req, res) => {
    console.log(
      "================================="
    );

    console.log(
      "❌ 404 ROUTE NOT FOUND"
    );

    console.log(
      "METHOD:",
      req.method
    );

    console.log(
      "PATH:",
      req.originalUrl
    );

    console.log(
      "================================="
    );

    return res.status(404).json({
      success: false,
      message: "Route Not Found",
      method: req.method,
      path: req.originalUrl,
    });
  }
);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (err, req, res, next) => {
    console.error(
      "======================================"
    );

    console.error(
      "❌ SERVER ERROR:"
    );

    console.error(err);

    console.error(
      "======================================"
    );

    return res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      "======================================"
    );

    console.log(
      "🚀 Student Resources Hub Backend"
    );

    console.log(
      `🚀 Running on port ${PORT}`
    );

    console.log(
      `🚀 API: http://localhost:${PORT}/api`
    );

    console.log(
      "======================================"
    );
  }
);
