const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    // ======================================
    // USER
    // ======================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ======================================
    // RESOURCE
    // ======================================

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// ONE BOOKMARK PER USER + RESOURCE
// ======================================

bookmarkSchema.index(
  {
    user: 1,
    resource: 1,
  },
  {
    unique: true,
  }
);

// ======================================
// FAST USER BOOKMARK LOOKUP
// ======================================

bookmarkSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Bookmark",
  bookmarkSchema
);