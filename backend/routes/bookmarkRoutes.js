const express = require("express");
const mongoose = require("mongoose");

const Bookmark = require("../models/Bookmark");
const Resource = require("../models/Resource");
const {
  authMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL USER BOOKMARKS
// ==========================================
//
// GET /api/bookmarks
//
// ==========================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const bookmarks = await Bookmark.find({
        user: req.user._id,
      })
        .populate("resource")
        .sort({
          createdAt: -1,
        });

      const resources = bookmarks
        .filter((bookmark) => bookmark.resource)
        .map((bookmark) => ({
          ...bookmark.resource.toObject(),
          bookmarkId: bookmark._id,
          bookmarkedAt: bookmark.createdAt,
        }));

      return res.status(200).json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "GET BOOKMARKS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load bookmarks",
      });
    }
  }
);

// ==========================================
// GET USER BOOKMARK IDS
// ==========================================
//
// GET /api/bookmarks/ids
//
// ==========================================

router.get(
  "/ids",
  authMiddleware,
  async (req, res) => {
    try {
      const bookmarks = await Bookmark.find({
        user: req.user._id,
      }).select("resource");

      const resourceIds = bookmarks.map(
        (bookmark) =>
          bookmark.resource.toString()
      );

      return res.status(200).json({
        success: true,
        resourceIds,
      });
    } catch (error) {
      console.error(
        "GET BOOKMARK IDS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load bookmark status",
      });
    }
  }
);

// ==========================================
// ADD BOOKMARK
// ==========================================
//
// POST /api/bookmarks/:resourceId
//
// ==========================================

router.post(
  "/:resourceId",
  authMiddleware,
  async (req, res) => {
    try {
      const { resourceId } = req.params;

      // ======================================
      // VALIDATE RESOURCE ID
      // ======================================

      if (
        !mongoose.Types.ObjectId.isValid(
          resourceId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      // ======================================
      // CHECK RESOURCE
      // ======================================

      const resource =
        await Resource.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // ======================================
      // CHECK EXISTING BOOKMARK
      // ======================================

      const existingBookmark =
        await Bookmark.findOne({
          user: req.user._id,
          resource: resourceId,
        });

      if (existingBookmark) {
        return res.status(200).json({
          success: true,
          bookmarked: true,
          message: "Resource already bookmarked",
          bookmark: existingBookmark,
        });
      }

      // ======================================
      // CREATE BOOKMARK
      // ======================================

      const bookmark =
        await Bookmark.create({
          user: req.user._id,
          resource: resourceId,
        });

      return res.status(201).json({
        success: true,
        bookmarked: true,
        message: "Resource bookmarked",
        bookmark,
      });
    } catch (error) {
      console.error(
        "ADD BOOKMARK ERROR:",
        error
      );

      // Handle duplicate index safely
      if (error.code === 11000) {
        return res.status(200).json({
          success: true,
          bookmarked: true,
          message: "Resource already bookmarked",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to bookmark resource",
      });
    }
  }
);

// ==========================================
// REMOVE BOOKMARK
// ==========================================
//
// DELETE /api/bookmarks/:resourceId
//
// ==========================================

router.delete(
  "/:resourceId",
  authMiddleware,
  async (req, res) => {
    try {
      const { resourceId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          resourceId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const bookmark =
        await Bookmark.findOneAndDelete({
          user: req.user._id,
          resource: resourceId,
        });

      if (!bookmark) {
        return res.status(404).json({
          success: false,
          message: "Bookmark not found",
        });
      }

      return res.status(200).json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      });
    } catch (error) {
      console.error(
        "REMOVE BOOKMARK ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to remove bookmark",
      });
    }
  }
);

module.exports = router;