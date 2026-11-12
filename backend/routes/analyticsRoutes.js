
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
  // Missing branch ko Computer Science maana jayega
  if (!branch || !String(branch).trim()) {
    return "Computer Science";
  }

  const value = String(branch).trim().toLowerCase();

  // Computer Science
  if (
    [
      "cse",
      "cs",
      "computer science",
      "computer science engineering",
      "computer science & engineering",
      "computer science and engineering",
      "computer science & engg",
      "computer science engg",
    ].includes(value)
  ) {
    return "Computer Science";
  }

  // Electrical
  if (
    [
      "ee",
      "electrical",
      "electrical engineering",
    ].includes(value)
  ) {
    return "Electrical";
  }

  // Mechanical
  if (
    [
      "me",
      "mechanical",
      "mechanical engineering",
    ].includes(value)
  ) {
    return "Mechanical";
  }

  // Civil / CTM
  if (
    [
      "civil",
      "ctm",
      "civil & ctm",
      "civil / ctm",
      "civil engineering / ctm",
      "civil engineering and ctm",
      "civil engineering",
    ].includes(value)
  ) {
    return "Civil & CTM";
  }

  // Electronics
  if (
    [
      "ece",
      "electronics",
      "electronics engineering",
      "electronics & communication",
      "electronics and communication",
    ].includes(value)
  ) {
    return "Electronics";
  }

  // Leather Technology
  if (
    [
      "lt",
      "leather",
      "leather technology",
    ].includes(value)
  ) {
    return "Leather Technology";
  }

  return String(branch).trim();
};

// ==========================================
// GET ADMIN ANALYTICS
// GET /api/admin/analytics
// ==========================================

router.get("/", ...adminAuth, async (req, res) => {
  try {
    // BASIC COUNTS
    const [
      totalUsers,
      totalAdmins,
      totalResources,
      totalBookmarks,
      totalNotifications,
      unreadNotifications,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "admin" }),
      Resource.countDocuments(),
      Bookmark.countDocuments(),
      Notification.countDocuments(),
      Notification.countDocuments({ isRead: false }),
    ]);

    // GET ALL RESOURCES
    const allResources = await Resource.find()
      .select("title branch semester category subject createdAt")
      .lean();

    // RESOURCES BY BRANCH
    const branchMap = {};

    allResources.forEach((resource) => {
      const normalizedBranch = normalizeBranch(resource.branch);

      branchMap[normalizedBranch] =
        (branchMap[normalizedBranch] || 0) + 1;
    });

    const resourcesByBranch = Object.entries(branchMap)
      .map(([branch, count]) => ({
        _id: branch,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // RESOURCES BY CATEGORY
    const categoryMap = {};

    allResources.forEach((resource) => {
      const category = resource.category
        ? String(resource.category).trim()
        : "Unknown";

      categoryMap[category] =
        (categoryMap[category] || 0) + 1;
    });

    const resourcesByCategory = Object.entries(categoryMap)
      .map(([category, count]) => ({
        _id: category,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // RESOURCES BY SEMESTER
    const semesterMap = {};

    allResources.forEach((resource) => {
      const semester = resource.semester
        ? String(resource.semester).trim()
        : "Unknown";

      semesterMap[semester] =
        (semesterMap[semester] || 0) + 1;
    });

    const resourcesBySemester = Object.entries(semesterMap)
      .map(([semester, count]) => ({
        _id: semester,
        count,
      }))
      .sort((a, b) => {
        const numberA = parseInt(
          a._id.match(/\d+/)?.[0] || "999",
          10
        );

        const numberB = parseInt(
          b._id.match(/\d+/)?.[0] || "999",
          10
        );

        return numberA - numberB;
      });

    // RECENT RESOURCES
    const recentResources = await Resource.find()
      .select("title branch semester category subject createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedRecentResources = recentResources.map(
      (resource) => ({
        ...resource,
        branch: normalizeBranch(resource.branch),
      })
    );

    // MOST BOOKMARKED RESOURCES
    const mostBookmarked = await Bookmark.aggregate([
      {
        $match: {
          resource: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$resource",
          bookmarks: { $sum: 1 },
        },
      },
      {
        $sort: { bookmarks: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "resources",
          localField: "_id",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: {
          path: "$resource",
          preserveNullAndEmptyArrays: false,
        },
      },
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

    const formattedMostBookmarked = mostBookmarked.map(
      (resource) => ({
        ...resource,
        branch: normalizeBranch(resource.branch),
      })
    );

    // DEBUG LOG
    console.log("==========================================");
    console.log("📊 ADMIN ANALYTICS");
    console.log("📚 TOTAL RESOURCES:", totalResources);
    console.log("🏫 RESOURCES BY BRANCH:", resourcesByBranch);
    console.log("📂 RESOURCES BY CATEGORY:", resourcesByCategory);
    console.log("🎓 RESOURCES BY SEMESTER:", resourcesBySemester);
    console.log("==========================================");

    // RESPONSE
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
      recentResources: formattedRecentResources,
      mostBookmarked: formattedMostBookmarked,
    });
  } catch (error) {
    console.error("ADMIN ANALYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin analytics",
    });
  }
});

module.exports = router;