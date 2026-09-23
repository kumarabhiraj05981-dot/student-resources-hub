const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");
const Notification = require("../models/Notification");
const User = require("../models/User");

const adminAuth = require("../middleware/adminAuth");

// ==========================================
// ALLOWED BRANCHES
// ==========================================

const ALLOWED_BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

// ==========================================
// ALLOWED CATEGORIES
// ==========================================

const ALLOWED_CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];

// ==========================================
// MULTER MEMORY STORAGE
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 500 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const isPDF =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return cb(
        new Error("Only PDF files are allowed")
      );
    }

    cb(null, true);
  },
});

// ==========================================
// TEST ROUTE
// ==========================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Upload route is working",
  });
});

// ==========================================
// UPLOAD PDF
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  adminAuth,
  upload.single("file"),

  async (req, res) => {
    try {
      console.log(
        "======================================"
      );

      console.log("📤 RESOURCE UPLOAD REQUEST");

      console.log(
        "======================================"
      );

      console.log("BODY:", req.body);
      console.log("FILE:", req.file?.originalname);
      console.log("MIME:", req.file?.mimetype);

      // ======================================
      // CHECK FILE
      // ======================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a PDF file",
        });
      }

      // ======================================
      // GET FORM DATA
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
      // TITLE VALIDATION
      // ======================================

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Resource title is required",
        });
      }

      const cleanTitle = title.trim();

      // ======================================
      // BRANCH VALIDATION
      // ======================================

      if (!branch || !branch.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select a branch",
        });
      }

      const cleanBranch = branch.trim();

      if (!ALLOWED_BRANCHES.includes(cleanBranch)) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch",
          allowedBranches: ALLOWED_BRANCHES,
        });
      }

      // ======================================
      // SEMESTER VALIDATION
      // ======================================

      if (!semester || !semester.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select semester",
        });
      }

      const cleanSemester = semester.trim();

      // ======================================
      // CATEGORY VALIDATION
      // ======================================

      if (!category || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select category",
        });
      }

      const cleanCategory = category.trim();

      if (!ALLOWED_CATEGORIES.includes(cleanCategory)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource category",
          allowedCategories: ALLOWED_CATEGORIES,
        });
      }

      // ======================================
      // SUBJECT
      // ======================================

      const cleanSubject = subject
        ? subject.trim()
        : "";

      // ======================================
      // DESCRIPTION
      // ======================================

      const cleanDescription = description
        ? description.trim()
        : "";

      // ======================================
      // ORIGINAL FILE NAME
      // ======================================

      const originalFileName =
        req.file.originalname;

      const extension =
        path.extname(originalFileName).toLowerCase();

      const nameWithoutExtension =
        path.basename(
          originalFileName,
          extension
        );

      // ======================================
      // SAFE FILE NAME
      // ======================================

      const cleanFileName =
        nameWithoutExtension
          .replace(/[^a-zA-Z0-9-_ ]/g, "")
          .trim()
          .replace(/\s+/g, "-");

      const safeFileName =
        cleanFileName || "resource";

      // ======================================
      // UNIQUE CLOUDINARY PUBLIC ID
      // ======================================

      const publicId =
        `${safeFileName}-${Date.now()}`;

      console.log(
        "--------------------------------------"
      );

      console.log("TITLE:", cleanTitle);
      console.log("BRANCH:", cleanBranch);
      console.log("SEMESTER:", cleanSemester);
      console.log("CATEGORY:", cleanCategory);
      console.log("SUBJECT:", cleanSubject);
      console.log("FILE:", originalFileName);
      console.log("PUBLIC ID:", publicId);

      console.log(
        "--------------------------------------"
      );

      // ======================================
      // CLOUDINARY UPLOAD PDF
      // ======================================

      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "student-resources",

                resource_type: "image",

                public_id: publicId,

                format: "pdf",

                overwrite: false,
              },

              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          stream.end(req.file.buffer);
        });
      };

      // ======================================
      // START CLOUDINARY UPLOAD
      // ======================================

      let cloudinaryResult;

      try {
        cloudinaryResult =
          await uploadToCloudinary();
      } catch (cloudinaryError) {
        console.error(
          "CLOUDINARY UPLOAD ERROR:",
          cloudinaryError
        );

        return res.status(500).json({
          success: false,
          message:
            "Failed to upload PDF to Cloudinary",
        });
      }

      // ======================================
      // CHECK CLOUDINARY RESULT
      // ======================================

      if (
        !cloudinaryResult ||
        !cloudinaryResult.secure_url
      ) {
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed",
        });
      }

      console.log(
        "CLOUDINARY URL:",
        cloudinaryResult.secure_url
      );

      console.log(
        "CLOUDINARY PUBLIC ID:",
        cloudinaryResult.public_id
      );

      // ======================================
      // CREATE MONGODB RESOURCE
      // ======================================

      const resource =
        new Resource({
          title: cleanTitle,

          description: cleanDescription,

          branch: cleanBranch,

          semester: cleanSemester,

          category: cleanCategory,

          subject: cleanSubject,

          fileUrl:
            cloudinaryResult.secure_url.replace(
              "/upload/",
              "/upload/fl_attachment:false/"
            ),

          filePublicId:
            cloudinaryResult.public_id,

          fileName:
            originalFileName,

          uploadedBy:
            req.user?._id,
        });

      // ======================================
      // SAVE TO MONGODB
      // ======================================

      await resource.save();

      console.log(
        "======================================"
      );

      console.log(
        "✅ RESOURCE SAVED SUCCESSFULLY"
      );

      console.log(
        "RESOURCE ID:",
        resource._id
      );

      console.log(
        "BRANCH:",
        resource.branch
      );

      console.log(
        "SEMESTER:",
        resource.semester
      );

      console.log(
        "CATEGORY:",
        resource.category
      );

      console.log(
        "======================================"
      );

      // ======================================
      // CREATE SMART NOTIFICATIONS
      // ======================================

      try {
        console.log(
          "🔔 CREATING SMART RESOURCE NOTIFICATIONS..."
        );

        console.log(
          "🎯 TARGET BRANCH:",
          resource.branch
        );

        console.log(
          "🎯 TARGET SEMESTER:",
          resource.semester
        );

        // ====================================
        // FIND ONLY MATCHING STUDENTS
        // ====================================

        const students =
          await User.find({
            role: { $ne: "admin" },

            branch: resource.branch,

            semester: resource.semester,
          }).select("_id name email branch semester");

        console.log(
          `🎯 MATCHING STUDENTS FOUND: ${students.length}`
        );

        if (students.length > 0) {
          const notifications =
            students.map((student) => ({
              user: student._id,

              title:
                `New ${resource.category || "Resource"} Added`,

              message:
                `${resource.title} has been added for ${resource.branch}, ${resource.semester}.`,

              type: "resource",

              resource: resource._id,

              isRead: false,
            }));

          await Notification.insertMany(
            notifications
          );

          console.log(
            `🔔 SMART NOTIFICATIONS CREATED FOR ${students.length} MATCHING STUDENTS`
          );

          students.forEach((student) => {
            console.log(
              `   👤 ${student.name || "Student"} | ${student.email} | ${student.branch} | ${student.semester}`
            );
          });
        } else {
          console.log(
            "ℹ️ NO MATCHING STUDENTS FOUND FOR THIS RESOURCE"
          );
        }
      } catch (notificationError) {
        // Notification fail hone par upload fail nahi hoga
        console.error(
          "❌ NOTIFICATION CREATION ERROR:",
          notificationError
        );
      }

      // ======================================
      // SUCCESS RESPONSE
      // ======================================

      return res.status(201).json({
        success: true,

        message:
          "PDF uploaded successfully!",

        resource,
      });

    } catch (error) {
      console.error(
        "======================================"
      );

      console.error(
        "❌ RESOURCE UPLOAD ERROR:"
      );

      console.error(error);

      console.error(
        "======================================"
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "PDF upload failed",
      });
    }
  }
);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;