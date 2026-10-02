const express = require("express");

const User = require("../models/User");
const Resource = require("../models/Resource");
const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

const adminAuth = [authMiddleware, adminMiddleware];

// ==========================================
// NORMALIZE BRANCH NAME
// ==========================================

const normalizeBranch = (branch) => {
  if (!branch) return "Unknown";

  const value = String(branch).trim().toLowerCase();

  // Computer Science
  if (
    value === "cse" ||
    value === "computer science" ||
    value === "computer science engineering" ||
    value === "computer science & engineering" ||
    value === "computer science and engineering"
  ) {
    return "Computer Science";
  }

  // Electrical
  if (
    value === "ee" ||
    value === "electrical" ||
    value === "electrical engineering"
  ) {
    return "Electrical";
  }

  // Mechanical
  if (
    value === "me" ||
    value === "mechanical" ||
    value === "mechanical engineering"
  ) {
    return "Mechanical";
  }

  // Civil / CTM
  if (
    value === "civil" ||
    value === "ctm" ||
    value === "civil & ctm" ||
    value === "civil / ctm" ||
    value === "civil engineering / ctm" ||
    value === "civil engineering and ctm" ||
    value === "civil engineering"
  ) {
    return "Civil & CTM";
  }

  // Electronics
  if (
    value === "ece" ||
    value === "electronics" ||
    value === "electronics engineering" ||
    value === "electronics & communication" ||
    value === "electronics and communication"
  ) {
    return "Electronics";
  }

  // Leather Technology
  if (
    value === "lt" ||
    value === "leather" ||
    value === "leather technology"
  ) {
    return "Leather Technology";
  }

  // Return original value if it is another branch
  return String(branch).trim();
};

// ==========================================
// GET ADMIN ANALYTICS
// ==========================================
// GET /api/admin/analytics
// ==========================================

router.get("/", ...adminAuth, async (req, res) => {
  try {
    // ======================================
    // BASIC COUNTS
    // ======================================

    const [
      totalUsers,
      totalAdmins,
      totalResources,
      totalBookmarks,
      totalNotifications,
      unreadNotifications,
    ] = await Promise.all([
      User.countDocuments({
        role: "user",
      }),

      User.countDocuments({
        role: "admin",
      }),

      Resource.countDocuments(),

      Bookmark.countDocuments(),

      Notification.countDocuments(),

      Notification.countDocuments({
        isRead: false,
      }),
    ]);

    // ======================================
    // GET ALL RESOURCES FOR NORMALIZED
    // BRANCH ANALYTICS
    // ======================================

    const allResources = await Resource.find()
      .select(
        "title branch semester category subject createdAt"
      )
      .lean();

    // ======================================
    // RESOURCES BY BRANCH
    // ======================================

    const branchMap = {};

    allResources.forEach((resource) => {
      const normalizedBranch = normalizeBranch(
        resource.branch
      );

      if (!branchMap[normalizedBranch]) {
        branchMap[normalizedBranch] = 0;
      }

      branchMap[normalizedBranch] += 1;
    });

    const resourcesByBranch = Object.entries(
      branchMap
    )
      .map(([branch, count]) => ({
        _id: branch,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // ======================================
    // RESOURCES BY CATEGORY
    // ======================================

    const categoryMap = {};

    allResources.forEach((resource) => {
      const category = resource.category
        ? String(resource.category).trim()
        : "Unknown";

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category] += 1;
    });

    const resourcesByCategory = Object.entries(
      categoryMap
    )
      .map(([category, count]) => ({
        _id: category,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // ======================================
    // RESOURCES BY SEMESTER
    // ======================================

    const semesterMap = {};

    allResources.forEach((resource) => {
      const semester = resource.semester
        ? String(resource.semester).trim()
        : "Unknown";

      if (!semesterMap[semester]) {
        semesterMap[semester] = 0;
      }

      semesterMap[semester] += 1;
    });

    const resourcesBySemester = Object.entries(
      semesterMap
    )
      .map(([semester, count]) => ({
        _id: semester,
        count,
      }))
      .sort((a, b) => {
        const numberA =
          parseInt(a._id.match(/\d+/)?.[0] || "999", 10);

        const numberB =
          parseInt(b._id.match(/\d+/)?.[0] || "999", 10);

        return numberA - numberB;
      });

    // ======================================
    // RECENT RESOURCES
    // ======================================

    const recentResources = await Resource.find()
      .select(
        "title branch semester category subject createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean();

    // Normalize branch in recent resources
    const formattedRecentResources =
      recentResources.map((resource) => ({
        ...resource,
        branch: normalizeBranch(resource.branch),
      }));

    // ======================================
    // MOST BOOKMARKED RESOURCES
    // ======================================

    const mostBookmarked = await Bookmark.aggregate([
      // Ignore invalid bookmark records
      {
        $match: {
          resource: {
            $ne: null,
          },
        },
      },

      // Count bookmarks for each resource
      {
        $group: {
          _id: "$resource",
          bookmarks: {
            $sum: 1,
          },
        },
      },

      // Highest bookmarks first
      {
        $sort: {
          bookmarks: -1,
        },
      },

      // Top 10
      {
        $limit: 10,
      },

      // Find resource information
      {
        $lookup: {
          from: "resources",
          localField: "_id",
          foreignField: "_id",
          as: "resource",
        },
      },

      // Convert resource array into object
      {
        $unwind: {
          path: "$resource",
          preserveNullAndEmptyArrays: false,
        },
      },

      // Select required fields
      {
        $project: {
          _id: "$resource._id",
          title: "$resource.title",
          branch: "$resource.branch",
          semester: "$resource.semester",
          category: "$resource.category",
          bookmarks: 1,
        },
      },
    ]);

    // Normalize branch in bookmarked resources
    const formattedMostBookmarked =
      mostBookmarked.map((resource) => ({
        ...resource,
        branch: normalizeBranch(resource.branch),
      }));

    // ======================================
    // DEBUG LOG
    // ======================================

    console.log(
      "=========================================="
    );

    console.log("📊 ADMIN ANALYTICS");

    console.log(
      "📚 TOTAL RESOURCES:",
      totalResources
    );

    console.log(
      "🏫 RESOURCES BY BRANCH:",
      resourcesByBranch
    );

    console.log(
      "📂 RESOURCES BY CATEGORY:",
      resourcesByCategory
    );

    console.log(
      "🎓 RESOURCES BY SEMESTER:",
      resourcesBySemester
    );

    console.log(
      "=========================================="
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      overview: {
        totalUsers,
        totalAdmins,
        totalResources,
        totalBookmarks,
        totalNotifications,
        unreadNotifications,
      },

      resourcesByBranch,

      resourcesByCategory,

      resourcesBySemester,

      recentResources:
        formattedRecentResources,

      mostBookmarked:
        formattedMostBookmarked,
    });
  } catch (error) {
    console.error(
      "ADMIN ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load admin analytics",
    });
  }
});

module.exports = router;