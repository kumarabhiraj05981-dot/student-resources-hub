const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ======================================
    // CHECK EXISTING USER
    // ======================================

    const exist = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ======================================
    // HASH PASSWORD
    // ======================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ======================================
    // CREATE USER
    // ======================================

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
      branch: "",
      semester: "",
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
      },
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // CHECK PASSWORD
    // ======================================

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // ======================================
    // CREATE JWT
    // ======================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET ||
        "studenthubsecret",
      {
        expiresIn: "7d",
      }
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch || "",
        semester: user.semester || "",
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// GET PROFILE
// ==========================================

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error(
        "GET PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// UPDATE PROFILE
// ==========================================
// Updates:
// - Name
// - Branch
// - Semester
// ==========================================

router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        branch,
        semester,
      } = req.body;

      // ====================================
      // NAME VALIDATION
      // ====================================

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      // ====================================
      // UPDATE USER
      // ====================================

      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            name: name.trim(),
            branch:
              branch?.trim() || "",
            semester:
              semester?.trim() || "",
          },
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

      // ====================================
      // USER NOT FOUND
      // ====================================

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // ====================================
      // SUCCESS
      // ====================================

      return res.json({
        success: true,
        message:
          "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      // ====================================
      // VALIDATION
      // ====================================

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password and new password are required",
        });
      }

      // ====================================
      // PASSWORD LENGTH
      // ====================================

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters",
        });
      }

      // ====================================
      // FIND USER
      // ====================================

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // ====================================
      // CHECK CURRENT PASSWORD
      // ====================================

      const passwordMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      // ====================================
      // HASH NEW PASSWORD
      // ====================================

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      // ====================================
      // SUCCESS
      // ====================================

      return res.json({
        success: true,
        message:
          "Password changed successfully",
      });
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;