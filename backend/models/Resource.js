const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    // ======================================
    // TITLE
    // ======================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ======================================
    // DESCRIPTION
    // ======================================

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================================
    // BRANCH
    // ======================================

    branch: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Electrical",
        "Mechanical",
        "Civil & CTM",
        "Electronics",
        "Leather Technology",
      ],
      default: "Computer Science",
      trim: true,
    },

    // ======================================
    // SEMESTER
    // ======================================

    semester: {
      type: String,
      required: true,
      trim: true,
    },

    // ======================================
    // CATEGORY
    // ======================================

    category: {
      type: String,
      required: true,
      enum: [
        "Notes",
        "PYQ",
        "Syllabus",
        "Ebooks",
        "Other",
      ],
      trim: true,
    },

    // ======================================
    // SUBJECT
    // ======================================

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================================
    // CLOUDINARY FILE URL
    // ======================================

    fileUrl: {
      type: String,
      required: true,
    },

    // ======================================
    // CLOUDINARY PUBLIC ID
    // ======================================

    filePublicId: {
      type: String,
      default: "",
    },

    // ======================================
    // ORIGINAL FILE NAME
    // ======================================

    fileName: {
      type: String,
      default: "",
    },

    // ======================================
    // UPLOADED BY
    // ======================================

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// INDEXES
// ======================================

resourceSchema.index({
  branch: 1,
  category: 1,
  semester: 1,
});

resourceSchema.index({
  subject: 1,
});

resourceSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  "Resource",
  resourceSchema
);
