const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC USER INFO
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ==========================================
    // USER ROLE
    // ==========================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ==========================================
    // STUDENT BRANCH
    // ==========================================

    branch: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // STUDENT SEMESTER
    // ==========================================

    semester: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);