const mongoose = require("mongoose");

// ======================================
// QUESTION SCHEMA
// ======================================

const questionSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "MCQ",
        "Short Answer",
        "Long Answer",
      ],
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      default: [],
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    // Advanced AI field
    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    // Marks assigned to this question
    marks: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Bloom's taxonomy level
    bloomLevel: {
      type: String,
      default: "Understand",
      enum: [
        "Remember",
        "Understand",
        "Apply",
        "Analyze",
        "Evaluate",
        "Create",
      ],
    },
  },
  {
    _id: false,
  }
);

// ======================================
// AI PAPER SCHEMA
// ======================================

const aiPaperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "AI Generated Question Paper",
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // Full syllabus / selected units
    unit: {
      type: String,
      default: "Full Syllabus",
      trim: true,
    },

    // Complete syllabus supplied by student
    syllabus: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      default: "Medium",
      enum: [
        "Easy",
        "Medium",
        "Hard",
      ],
    },

    questionType: {
      type: String,
      default: "Mixed",
      enum: [
        "MCQ",
        "Short Answer",
        "Long Answer",
        "Mixed",
      ],
    },

    questionCount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    // ======================================
    // ADVANCED EXAM SETTINGS
    // ======================================

    examPattern: {
      type: String,
      default: "General",
      trim: true,
    },

    language: {
      type: String,
      default: "English",
      enum: [
        "English",
        "Hindi",
        "Hinglish",
      ],
    },

    totalMarks: {
      type: Number,
      default: 100,
      min: 1,
    },

    duration: {
      type: String,
      default: "2 Hours",
      trim: true,
    },

    bloomLevel: {
      type: String,
      default: "Mixed",
      enum: [
        "Mixed",
        "Remember",
        "Understand",
        "Apply",
        "Analyze",
        "Evaluate",
        "Create",
      ],
    },

    includeExplanations: {
      type: Boolean,
      default: true,
    },

    // ======================================
    // QUESTIONS
    // ======================================

    questions: {
      type: [questionSchema],
      required: true,

      validate: {
        validator: function (questions) {
          return (
            questions &&
            questions.length > 0
          );
        },

        message:
          "At least one question is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// MODEL
// ======================================

module.exports = mongoose.model(
  "AIPaper",
  aiPaperSchema
);