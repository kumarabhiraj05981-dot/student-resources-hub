const express = require("express");
const mongoose = require("mongoose");

const Resource = require("../models/Resource");
const Notification = require("../models/Notification");
const User = require("../models/User");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ADMIN AUTH MIDDLEWARE
// ==========================================

const adminAuth = [authMiddleware, adminMiddleware];

// ==========================================
// ALLOWED VALUES
// ==========================================

const ALLOWED_BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

const ALLOWED_CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];

// ==========================================
// GET ALL RESOURCES
// ==========================================

router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("GET ALL RESOURCES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
});

// ==========================================
// GET RECENT RESOURCES
// ==========================================

router.get("/recent", async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit) || 6;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      20
    );

    const resources = await Resource.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error(
      "GET RECENT RESOURCES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load recently added resources",
    });
  }
});

// ==========================================
// GET RESOURCES BY BRANCH
// ==========================================

router.get("/branch/:branch", async (req, res) => {
  try {
    const branch = decodeURIComponent(
      req.params.branch
    );

    const resources = await Resource.find({
      branch,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error(
      "GET RESOURCES BY BRANCH ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch branch resources",
    });
  }
});

// ==========================================
// GET RESOURCES BY BRANCH + CATEGORY
// ==========================================

router.get(
  "/branch/:branch/category/:category",
  async (req, res) => {
    try {
      const branch = decodeURIComponent(
        req.params.branch
      );

      const category = decodeURIComponent(
        req.params.category
      );

      const resources = await Resource.find({
        branch,
        category,
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "GET BRANCH CATEGORY RESOURCES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch resources",
      });
    }
  }
);

// ==========================================
// GET RESOURCES BY CATEGORY
// ==========================================

router.get(
  "/category/:category",
  async (req, res) => {
    try {
      const category = decodeURIComponent(
        req.params.category
      );

      const resources = await Resource.find({
        category,
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "GET RESOURCES BY CATEGORY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch category resources",
      });
    }
  }
);

// ==========================================
// GET RESOURCES BY SEMESTER
// ==========================================

router.get(
  "/semester/:semester",
  async (req, res) => {
    try {
      const semester = decodeURIComponent(
        req.params.semester
      );

      const resources = await Resource.find({
        semester,
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "GET RESOURCES BY SEMESTER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch semester resources",
      });
    }
  }
);

// ==========================================
// GET RESOURCES BY BRANCH + SEMESTER
// ==========================================

router.get(
  "/branch/:branch/semester/:semester",
  async (req, res) => {
    try {
      const branch = decodeURIComponent(
        req.params.branch
      );

      const semester = decodeURIComponent(
        req.params.semester
      );

      const resources = await Resource.find({
        branch,
        semester,
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "GET BRANCH SEMESTER RESOURCES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch resources",
      });
    }
  }
);

// ==========================================
// GET RESOURCES BY BRANCH + SEMESTER + CATEGORY
// ==========================================

router.get(
  "/branch/:branch/semester/:semester/category/:category",
  async (req, res) => {
    try {
      const branch = decodeURIComponent(
        req.params.branch
      );

      const semester = decodeURIComponent(
        req.params.semester
      );

      const category = decodeURIComponent(
        req.params.category
      );

      const resources = await Resource.find({
        branch,
        semester,
        category,
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "GET BRANCH SEMESTER CATEGORY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch resources",
      });
    }
  }
);

// ==========================================
// SEARCH RESOURCES
// ==========================================

router.get(
  "/search/:keyword",
  async (req, res) => {
    try {
      const keyword = decodeURIComponent(
        req.params.keyword
      );

      const regex = new RegExp(
        keyword,
        "i"
      );

      const resources = await Resource.find({
        $or: [
          { title: regex },
          { description: regex },
          { subject: regex },
          { branch: regex },
          { category: regex },
          { semester: regex },
        ],
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "SEARCH RESOURCES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to search resources",
      });
    }
  }
);

// ==========================================
// UPDATE RESOURCE METADATA - ADMIN ONLY
// ==========================================
// IMPORTANT:
// This updates only metadata.
// Cloudinary PDF/file fields are NOT changed.
// ==========================================

router.put(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      // ======================================
      // VALIDATE RESOURCE ID
      // ======================================

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      // ======================================
      // FIND OLD RESOURCE
      // ======================================

      const oldResource =
        await Resource.findById(id);

      if (!oldResource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // ======================================
      // GET FIELDS
      // ======================================

      const {
        title,
        description,
        branch,
        semester,
        category,
        subject,
      } = req.body;

      // ======================================
      // VALIDATION
      // ======================================

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Resource title is required",
        });
      }

      if (
        !branch ||
        !ALLOWED_BRANCHES.includes(branch)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch",
        });
      }

      if (!semester || !semester.trim()) {
        return res.status(400).json({
          success: false,
          message: "Semester is required",
        });
      }

      if (
        !category ||
        !ALLOWED_CATEGORIES.includes(category)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // ======================================
      // CLEAN UPDATED VALUES
      // ======================================

      const updatedTitle =
        title.trim();

      const updatedDescription =
        description?.trim() || "";

      const updatedBranch =
        branch.trim();

      const updatedSemester =
        semester.trim();

      const updatedCategory =
        category.trim();

      const updatedSubject =
        subject?.trim() || "";

      // ======================================
      // CHECK WHAT ACTUALLY CHANGED
      // ======================================

      const changedFields = [];

      if (
        oldResource.title !==
        updatedTitle
      ) {
        changedFields.push("title");
      }

      if (
        (oldResource.description || "") !==
        updatedDescription
      ) {
        changedFields.push("description");
      }

      if (
        oldResource.branch !==
        updatedBranch
      ) {
        changedFields.push("branch");
      }

      if (
        oldResource.semester !==
        updatedSemester
      ) {
        changedFields.push("semester");
      }

      if (
        oldResource.category !==
        updatedCategory
      ) {
        changedFields.push("category");
      }

      if (
        (oldResource.subject || "") !==
        updatedSubject
      ) {
        changedFields.push("subject");
      }

      // ======================================
      // UPDATE ONLY METADATA
      // ======================================

      const resource =
        await Resource.findByIdAndUpdate(
          id,
          {
            title: updatedTitle,

            description:
              updatedDescription,

            branch:
              updatedBranch,

            semester:
              updatedSemester,

            category:
              updatedCategory,

            subject:
              updatedSubject,
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "uploadedBy",
          "name email"
        );

      // ======================================
      // CREATE SMART NOTIFICATIONS
      // ======================================
      //
      // Notification is created only if
      // something actually changed.
      //
      // Students must match:
      // resource.branch
      // AND
      // resource.semester
      //
      // Admins are excluded.
      // ======================================

      if (changedFields.length > 0) {
        try {
          console.log(
            "🔔 CREATING SMART RESOURCE UPDATE NOTIFICATIONS..."
          );

          console.log(
            "🎯 TARGET BRANCH:",
            resource.branch
          );

          console.log(
            "🎯 TARGET SEMESTER:",
            resource.semester
          );

          console.log(
            "📝 CHANGED FIELDS:",
            changedFields
          );

          // ====================================
          // FIND ONLY MATCHING STUDENTS
          // ====================================

          const students =
            await User.find({
              role: { $ne: "admin" },

              branch: resource.branch,

              semester: resource.semester,
            }).select(
              "_id name email branch semester"
            );

          console.log(
            `🎯 MATCHING STUDENTS FOUND: ${students.length}`
          );

          // ====================================
          // CREATE NOTIFICATIONS
          // ====================================

          if (students.length > 0) {
            const notifications =
              students.map((student) => ({
                user: student._id,

                title:
                  "Resource Updated",

                message:
                  `${resource.title} has been updated for ${resource.branch}, ${resource.semester}.`,

                type:
                  "resource",

                resource:
                  resource._id,

                isRead:
                  false,
              }));

            await Notification.insertMany(
              notifications
            );

            console.log(
              `🔔 SMART UPDATE NOTIFICATIONS CREATED FOR ${students.length} MATCHING STUDENTS`
            );

            students.forEach(
              (student) => {
                console.log(
                  `   👤 ${student.name || "Student"} | ${student.email} | ${student.branch} | ${student.semester}`
                );
              }
            );
          } else {
            console.log(
              "ℹ️ NO MATCHING STUDENTS FOUND FOR RESOURCE UPDATE"
            );
          }
        } catch (notificationError) {
          console.error(
            "❌ SMART UPDATE NOTIFICATION CREATION ERROR:",
            notificationError
          );

          // Notification failure should NOT
          // make resource update fail.
        }
      } else {
        console.log(
          "ℹ️ NO RESOURCE CHANGES DETECTED - NOTIFICATION SKIPPED"
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      console.log(
        "RESOURCE UPDATED:",
        resource._id
      );

      console.log(
        "CHANGED FIELDS:",
        changedFields
      );

      return res.status(200).json({
        success: true,

        message:
          "Resource updated successfully",

        resource,
      });
    } catch (error) {
      console.error(
        "UPDATE RESOURCE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to update resource",
      });
    }
  }
);

// ==========================================
// DELETE RESOURCE - ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      // ======================================
      // VALIDATE ID
      // ======================================

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      // ======================================
      // FIND RESOURCE
      // ======================================

      const resource =
        await Resource.findById(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // ======================================
      // DELETE CLOUDINARY FILE
      // ======================================

      try {
        const cloudinary =
          require("cloudinary").v2;

        if (resource.publicId) {
          await cloudinary.uploader.destroy(
            resource.publicId,
            {
              resource_type: "raw",
            }
          );

          console.log(
            "☁️ CLOUDINARY FILE DELETED:",
            resource.publicId
          );
        }
      } catch (cloudinaryError) {
        console.error(
          "CLOUDINARY DELETE ERROR:",
          cloudinaryError
        );

        // Continue MongoDB deletion even if
        // Cloudinary deletion fails.
      }

      // ======================================
      // DELETE DATABASE RECORD
      // ======================================

      await Resource.findByIdAndDelete(id);

      console.log(
        "RESOURCE DELETED:",
        id
      );

      return res.status(200).json({
        success: true,
        message:
          "Resource deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE RESOURCE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to delete resource",
      });
    }
  }
);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;