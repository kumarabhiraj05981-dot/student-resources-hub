const express = require("express");
const router = express.Router();

const { GoogleGenAI, Type } = require("@google/genai");

const AIPaper = require("../models/AIPaper");

const {
  authMiddleware,
} = require("../middleware/authMiddleware");

// ======================================
// GEMINI CONFIG
// ======================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.6-flash";

// ======================================
// CONSTANTS
// ======================================

const ALLOWED_DIFFICULTIES = [
  "Easy",
  "Medium",
  "Hard",
];

const ALLOWED_QUESTION_TYPES = [
  "MCQ",
  "Short Answer",
  "Long Answer",
  "Mixed",
];

const ALLOWED_LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
];

const ALLOWED_BLOOM_LEVELS = [
  "Mixed",
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

const QUESTION_BLOOM_LEVELS = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

// ======================================
// HELPER FUNCTIONS
// ======================================

function normalizeText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  );
}

function normalizeQuestionType(type) {
  const value = String(type || "")
    .trim()
    .toLowerCase();

  if (
    value === "mcq" ||
    value === "multiple choice" ||
    value === "multiple-choice"
  ) {
    return "MCQ";
  }

  if (
    value === "short" ||
    value === "short answer" ||
    value === "short-answer"
  ) {
    return "Short Answer";
  }

  if (
    value === "long" ||
    value === "long answer" ||
    value === "long-answer"
  ) {
    return "Long Answer";
  }

  if (value === "mixed") {
    return "Mixed";
  }

  return "Mixed";
}

function normalizeDifficulty(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();

  if (text === "easy") return "Easy";
  if (text === "hard") return "Hard";

  return "Medium";
}

function normalizeLanguage(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();

  if (text === "hindi") return "Hindi";
  if (text === "hinglish") return "Hinglish";

  return "English";
}

function normalizeBloomLevel(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();

  const map = {
    mixed: "Mixed",
    remember: "Remember",
    understand: "Understand",
    apply: "Apply",
    analyze: "Analyze",
    evaluate: "Evaluate",
    create: "Create",
  };

  return map[text] || "Mixed";
}

function normalizeQuestionBloomLevel(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();

  const map = {
    remember: "Remember",
    understand: "Understand",
    apply: "Apply",
    analyze: "Analyze",
    evaluate: "Evaluate",
    create: "Create",
  };

  return map[text] || "Understand";
}

function normalizeExamPattern(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "General";
  }

  return text.slice(0, 100);
}

function normalizeDuration(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "2 Hours";
  }

  return text.slice(0, 50);
}

function parseBoolean(value, defaultValue = true) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const text = String(value)
    .trim()
    .toLowerCase();

  if (["false", "0", "no", "off"].includes(text)) {
    return false;
  }

  if (["true", "1", "yes", "on"].includes(text)) {
    return true;
  }

  return defaultValue;
}

// ======================================
// BUILD MARK DISTRIBUTION
// ======================================

function buildMarkGuidance(questionCount, totalMarks) {
  const average =
    totalMarks / questionCount;

  if (Number.isInteger(average)) {
    return `Use approximately ${average} mark(s) per question and make the total exactly ${totalMarks}.`;
  }

  return `
Distribute marks intelligently according to question type.
MCQs should generally have fewer marks.
Short answers should have moderate marks.
Long answers should have higher marks.
The sum of ALL question marks MUST be exactly ${totalMarks}.
`;
}

// ======================================
// VALIDATE + CLEAN QUESTIONS
// ======================================

function validateAndCleanQuestions(
  questions,
  settings
) {
  if (!Array.isArray(questions)) {
    throw new Error(
      "Gemini did not return a valid questions array"
    );
  }

  if (
    questions.length !==
    settings.questionCount
  ) {
    throw new Error(
      `Gemini generated ${questions.length} questions instead of ${settings.questionCount}. Please try again.`
    );
  }

  const seenQuestions = new Set();

  const cleanedQuestions = [];

  let totalGeneratedMarks = 0;

  for (
    let index = 0;
    index < questions.length;
    index++
  ) {
    const item = questions[index];

    // ======================================
    // QUESTION TEXT
    // ======================================

    const questionText = String(
      item?.question || ""
    ).trim();

    if (!questionText) {
      throw new Error(
        `Question ${index + 1} has no question text`
      );
    }

    // ======================================
    // DUPLICATE CHECK
    // ======================================

    const normalizedQuestion =
      normalizeText(questionText);

    if (
      seenQuestions.has(
        normalizedQuestion
      )
    ) {
      throw new Error(
        `Duplicate question detected at question ${index + 1}. Please generate again.`
      );
    }

    seenQuestions.add(
      normalizedQuestion
    );

    // ======================================
    // TYPE
    // ======================================

    const type =
      normalizeQuestionType(item?.type);

    // ======================================
    // VALID TYPE
    // ======================================

    if (
      !ALLOWED_QUESTION_TYPES.includes(
        type
      ) ||
      type === "Mixed"
    ) {
      throw new Error(
        `Invalid question type at question ${index + 1}`
      );
    }

    // ======================================
    // OPTIONS
    // ======================================

    let options = [];

    if (Array.isArray(item?.options)) {
      options = item.options
        .map((option) =>
          String(option || "").trim()
        )
        .filter(Boolean);
    }

    // ======================================
    // ANSWER
    // ======================================

    const answer = String(
      item?.answer || ""
    ).trim();

    if (isEmpty(answer)) {
      throw new Error(
        `Question ${index + 1} does not have a valid answer`
      );
    }

    // ======================================
    // MCQ VALIDATION
    // ======================================

    if (type === "MCQ") {
      if (options.length !== 4) {
        throw new Error(
          `MCQ question ${index + 1} must have exactly 4 options`
        );
      }

      const normalizedOptions =
        options.map((option) =>
          normalizeText(option)
        );

      const uniqueOptions =
        new Set(normalizedOptions);

      if (
        uniqueOptions.size !== 4
      ) {
        throw new Error(
          `MCQ question ${index + 1} contains duplicate options`
        );
      }

      const answerExists =
        options.some(
          (option) =>
            normalizeText(option) ===
            normalizeText(answer)
        );

      if (!answerExists) {
        throw new Error(
          `MCQ question ${index + 1} answer does not match any option`
        );
      }
    } else {
      options = [];
    }

    // ======================================
    // REQUESTED TYPE VALIDATION
    // ======================================

    if (
      settings.questionType !== "Mixed" &&
      type !== settings.questionType
    ) {
      throw new Error(
        `Question ${index + 1} is ${type}, but ${settings.questionType} was requested`
      );
    }

    // ======================================
    // MIXED VALIDATION
    // ======================================

    if (
      settings.questionType === "Mixed" &&
      settings.questionCount >= 3
    ) {
      // checked after loop
    }

    // ======================================
    // MARKS
    // ======================================

    const marks = Number(item?.marks);

    if (
      !Number.isInteger(marks) ||
      marks < 1 ||
      marks > settings.totalMarks
    ) {
      throw new Error(
        `Question ${index + 1} has invalid marks`
      );
    }

    totalGeneratedMarks += marks;

    // ======================================
    // EXPLANATION
    // ======================================

    let explanation = "";

    if (settings.includeExplanations) {
      explanation = String(
        item?.explanation || ""
      ).trim();

      if (!explanation) {
        throw new Error(
          `Question ${index + 1} is missing its explanation`
        );
      }
    }

    // ======================================
    // BLOOM LEVEL
    // ======================================

    const bloomLevel =
      normalizeQuestionBloomLevel(
        item?.bloomLevel
      );

    // ======================================
    // FINAL QUESTION
    // ======================================

    cleanedQuestions.push({
      number: index + 1,
      type,
      question: questionText,
      options,
      answer,
      explanation,
      marks,
      bloomLevel,
    });
  }

  // ======================================
  // MIXED TYPE VALIDATION
  // ======================================

  if (
    settings.questionType === "Mixed" &&
    settings.questionCount >= 3
  ) {
    const types = new Set(
      cleanedQuestions.map(
        (question) => question.type
      )
    );

    if (types.size < 2) {
      throw new Error(
        "Mixed mode must contain at least two different question types"
      );
    }
  }

  // ======================================
  // TOTAL MARK VALIDATION
  // ======================================

  if (
    totalGeneratedMarks !==
    settings.totalMarks
  ) {
    throw new Error(
      `Generated question marks total ${totalGeneratedMarks}, but required total is ${settings.totalMarks}`
    );
  }

  return cleanedQuestions;
}

// ======================================
// AI STUDY ASSISTANT
// ======================================

router.post(
  "/study-assistant",
  authMiddleware,
  async (req, res) => {
    try {
      const message = String(
        req.body?.message || ""
      ).trim();

      const subject = String(
        req.body?.subject || ""
      ).trim();

      const language = String(
        req.body?.language || "English"
      ).trim();

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      if (message.length > 4000) {
        return res.status(400).json({
          success: false,
          message:
            "Message must be 4000 characters or less",
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          message:
            "Gemini API key is not configured on server",
        });
      }

      const prompt = `
You are the Student Resources Hub AI Study Assistant.

Help students understand academic concepts clearly
and accurately.

Use:
- Simple language
- Step-by-step explanations
- Short examples
- Exam-focused tips
- Important points where useful

Do not invent facts.

Answer in ${language}.

${
  subject
    ? `Current subject: ${subject}`
    : "No subject selected."
}

Student question:

${message}
`;

      const response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,

          config: {
            systemInstruction:
              "You are a patient tutor for diploma and college students. Help students learn concepts and prepare for exams.",
          },
        });

      const answer = String(
        response.text || ""
      ).trim();

      if (!answer) {
        throw new Error(
          "AI returned an empty response"
        );
      }

      return res.status(200).json({
        success: true,
        answer,
      });

    } catch (error) {

      console.error(
        "Study assistant error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to get an AI study response right now",
      });
    }
  }
); 

// ======================================
// GENERATE + SAVE AI QUESTION PAPER
// ======================================

router.post(
  "/generate-paper",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        subject,
        syllabus,
        units,
        unit,
        difficulty,
        questionCount,
        questionType,
        examPattern,
        language,
        totalMarks,
        duration,
        bloomLevel,
        includeExplanations,
      } = req.body;

      // ======================================
      // SUBJECT VALIDATION
      // ======================================

      if (
        !subject ||
        String(subject).trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message: "Subject is required",
        });
      }

      // ======================================
      // GEMINI KEY VALIDATION
      // ======================================

      if (!process.env.GEMINI_API_KEY) {
        console.error(
          "GEMINI_API_KEY is missing"
        );

        return res.status(500).json({
          success: false,
          message:
            "Gemini API key is not configured on server",
        });
      }

      // ======================================
      // NORMALIZE SETTINGS
      // ======================================

      const parsedQuestionCount =
        Number(questionCount);

      const parsedTotalMarks =
        Number(totalMarks);

      const settings = {
        subject: String(subject).trim(),

        syllabus:
          syllabus &&
          String(syllabus).trim()
            ? String(syllabus).trim()
            : "",

        units:
          Array.isArray(units)
            ? units
                .map((item) =>
                  String(item || "").trim()
                )
                .filter(Boolean)
            : [],

        unit:
          unit &&
          String(unit).trim()
            ? String(unit).trim()
            : "Full Syllabus",

        difficulty:
          normalizeDifficulty(
            difficulty
          ),

        questionCount:
          Number.isInteger(
            parsedQuestionCount
          )
            ? parsedQuestionCount
            : 20,

        questionType:
          normalizeQuestionType(
            questionType
          ),

        examPattern:
          normalizeExamPattern(
            examPattern
          ),

        language:
          normalizeLanguage(language),

        totalMarks:
          Number.isInteger(
            parsedTotalMarks
          )
            ? parsedTotalMarks
            : 100,

        duration:
          normalizeDuration(duration),

        bloomLevel:
          normalizeBloomLevel(
            bloomLevel
          ),

        includeExplanations:
          parseBoolean(
            includeExplanations,
            true
          ),
      };

      // ======================================
      // QUESTION COUNT VALIDATION
      // ======================================

      if (
        !Number.isInteger(
          settings.questionCount
        ) ||
        settings.questionCount < 1 ||
        settings.questionCount > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question count must be a whole number between 1 and 100",
        });
      }

      // ======================================
      // TOTAL MARKS VALIDATION
      // ======================================

      if (
        !Number.isInteger(
          settings.totalMarks
        ) ||
        settings.totalMarks < 1 ||
        settings.totalMarks > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Total marks must be a whole number between 1 and 1000",
        });
      }

      // ======================================
      // QUESTION TYPE VALIDATION
      // ======================================

      if (
        !ALLOWED_QUESTION_TYPES.includes(
          settings.questionType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid question type",
        });
      }

      // ======================================
      // SYLLABUS FALLBACK
      // ======================================

      if (
        !settings.syllabus &&
        settings.unit !== "Full Syllabus"
      ) {
        settings.syllabus =
          settings.unit;
      }

      // ======================================
      // LOG REQUEST
      // ======================================

      console.log(
        "================================="
      );

      console.log(
        "ADVANCED GEMINI PAPER REQUEST"
      );

      console.log({
        userId: req.user._id,
        userName: req.user.name,
        ...settings,
      });

      console.log(
        "Model:",
        GEMINI_MODEL
      );

      console.log(
        "================================="
      );

      // ======================================
      // UNIT INFORMATION
      // ======================================

      const unitsText =
        settings.units.length > 0
          ? settings.units
              .map(
                (item, index) =>
                  `Unit ${index + 1}: ${item}`
              )
              .join("\n")
          : "Use the supplied syllabus/full syllabus.";

      // ======================================
      // LANGUAGE INSTRUCTION
      // ======================================

      let languageInstruction =
        "Write the entire question paper in clear English.";

      if (
        settings.language === "Hindi"
      ) {
        languageInstruction =
          "Write the entire question paper in clear Hindi using Devanagari script.";
      }

      if (
        settings.language === "Hinglish"
      ) {
        languageInstruction =
          "Write the question paper in simple Hinglish using English letters, suitable for Indian students.";
      }

      // ======================================
      // BLOOM INSTRUCTION
      // ======================================

      let bloomInstruction =
        "Use a balanced mixture of Bloom's taxonomy levels.";

      if (
        settings.bloomLevel !== "Mixed"
      ) {
        bloomInstruction = `
Every question must primarily test the "${settings.bloomLevel}" level of Bloom's Taxonomy.
`;
      }

      // ======================================
      // EXPLANATION INSTRUCTION
      // ======================================

      const explanationInstruction =
        settings.includeExplanations
          ? `
Every question MUST include a useful explanation.
The explanation must briefly explain why the answer is correct.
`
          : `
Do not generate explanations.
Set explanation to an empty string.
`;

      // ======================================
      // MARK GUIDANCE
      // ======================================

      const markGuidance =
        buildMarkGuidance(
          settings.questionCount,
          settings.totalMarks
        );

      // ======================================
      // ADVANCED AI PROMPT
      // ======================================

      const prompt = `
You are an expert educational assessment designer and university/polytechnic examination paper generator.

Generate a high-quality examination/practice question paper.

========================================
PAPER SETTINGS
========================================

Subject:
${settings.subject}

Syllabus:
${settings.syllabus || "Full syllabus"}

Units:
${unitsText}

Difficulty:
${settings.difficulty}

Question Count:
${settings.questionCount}

Question Type:
${settings.questionType}

Exam Pattern:
${settings.examPattern}

Language:
${settings.language}

Total Marks:
${settings.totalMarks}

Duration:
${settings.duration}

Bloom's Taxonomy:
${settings.bloomLevel}

========================================
IMPORTANT LANGUAGE RULE
========================================

${languageInstruction}

========================================
BLOOM'S TAXONOMY
========================================

${bloomInstruction}

Available levels:

- Remember
- Understand
- Apply
- Analyze
- Evaluate
- Create

========================================
MARKING RULES
========================================

${markGuidance}

The marks of ALL questions must add up to EXACTLY ${settings.totalMarks}.

Do not exceed the total marks.

========================================
GENERAL RULES
========================================

1. Generate EXACTLY ${settings.questionCount} questions.
2. Every question must be unique.
3. Never repeat or merely rephrase another question.
4. Every question must be academically meaningful.
5. Every question must be relevant to the supplied subject and syllabus.
6. Follow the requested difficulty.
7. Use student-friendly examination language.
8. Avoid ambiguous questions.
9. Avoid questions with multiple possible correct answers unless the question type naturally requires it.
10. Every question MUST have a correct answer.
11. Never leave answer empty.
12. Never use "N/A".
13. Never use "Answer not provided".
14. Never use placeholders.
15. Question numbers must be sequential.
16. Return ONLY structured JSON.
17. Do not return Markdown.
18. Do not add comments outside JSON.

========================================
MCQ RULES
========================================

If the question type is MCQ:

- Every question must have type "MCQ".
- Exactly 4 options.
- All 4 options must be different.
- Only one option should be clearly correct.
- The answer must exactly match the complete correct option text.
- Do not use only "A", "B", "C", or "D" as the answer.

========================================
SHORT ANSWER RULES
========================================

If the question type is Short Answer:

- Every question must have type "Short Answer".
- options must be [].
- Answer must be concise but correct.
- Marks should be appropriate for a short-answer question.

========================================
LONG ANSWER RULES
========================================

If the question type is Long Answer:

- Every question must have type "Long Answer".
- options must be [].
- Answer must be a useful model examination answer.
- Include important points, explanation, and examples where appropriate.
- Marks should be higher than simple MCQs where possible.

========================================
MIXED MODE
========================================

If Question Type is Mixed:

Use a balanced combination of:

- MCQ
- Short Answer
- Long Answer

For 3 or more questions, use at least two different question types.

For larger papers, try to use all three types.

========================================
EXPLANATIONS
========================================

${explanationInstruction}

========================================
OUTPUT REQUIREMENTS
========================================

Return one JSON object with:

- title
- subject
- unit
- difficulty
- questionType
- examPattern
- language
- totalMarks
- duration
- bloomLevel
- questions

Every question must contain:

- number
- type
- question
- options
- answer
- explanation
- marks
- bloomLevel

The paper-level totalMarks must be exactly:
${settings.totalMarks}

The sum of question marks must be exactly:
${settings.totalMarks}

========================================
FINAL QUALITY CHECK
========================================

Before returning the JSON, internally verify:

1. Exact question count.
2. No duplicate questions.
3. Correct question types.
4. Exactly 4 options for every MCQ.
5. MCQ answers match an option exactly.
6. Non-MCQ options are [].
7. Every answer is valid.
8. Every question has valid marks.
9. Sum of all marks equals ${settings.totalMarks}.
10. Bloom level is valid.
11. Language is consistent.
12. Difficulty is consistent.
13. Questions are relevant to the syllabus.
14. Explanations are present when requested.

Return ONLY the final JSON object.
`;

      // ======================================
      // GEMINI QUESTION SCHEMA
      // ======================================

      const questionSchema = {
        type: Type.OBJECT,

        properties: {
          number: {
            type: Type.INTEGER,
          },

          type: {
            type: Type.STRING,
          },

          question: {
            type: Type.STRING,
          },

          options: {
            type: Type.ARRAY,

            items: {
              type: Type.STRING,
            },
          },

          answer: {
            type: Type.STRING,
          },

          explanation: {
            type: Type.STRING,
          },

          marks: {
            type: Type.INTEGER,
          },

          bloomLevel: {
            type: Type.STRING,
          },
        },

        required: [
          "number",
          "type",
          "question",
          "answer",
          "marks",
          "bloomLevel",
        ],
      };

      // ======================================
      // GEMINI PAPER SCHEMA
      // ======================================

      const paperSchema = {
        type: Type.OBJECT,

        properties: {
          title: {
            type: Type.STRING,
          },

          subject: {
            type: Type.STRING,
          },

          unit: {
            type: Type.STRING,
          },

          difficulty: {
            type: Type.STRING,
          },

          questionType: {
            type: Type.STRING,
          },

          examPattern: {
            type: Type.STRING,
          },

          language: {
            type: Type.STRING,
          },

          totalMarks: {
            type: Type.INTEGER,
          },

          duration: {
            type: Type.STRING,
          },

          bloomLevel: {
            type: Type.STRING,
          },

          questions: {
            type: Type.ARRAY,
            items: questionSchema,
          },
        },

        required: [
          "title",
          "subject",
          "unit",
          "difficulty",
          "questionType",
          "examPattern",
          "language",
          "totalMarks",
          "duration",
          "bloomLevel",
          "questions",
        ],
      };

      // ======================================
      // CALL GEMINI
      // ======================================

      console.log(
        "Sending advanced request to Gemini..."
      );

      const response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,

          contents: prompt,

          config: {
            responseMimeType:
              "application/json",

            responseSchema:
              paperSchema,

            systemInstruction:
              "You are an expert educational assessment designer. Generate accurate, structured examination papers. Always return valid JSON matching the requested schema.",
          },
        });

      // ======================================
      // READ RESPONSE
      // ======================================

      const aiText =
        response?.text;

      if (!aiText) {
        console.error(
          "GEMINI EMPTY RESPONSE:",
          response
        );

        return res.status(502).json({
          success: false,
          message:
            "Gemini returned an empty response. Please try again.",
        });
      }

      console.log(
        "GEMINI ADVANCED RESPONSE RECEIVED"
      );

      // ======================================
      // PARSE JSON
      // ======================================

      let paper;

      try {
        paper = JSON.parse(aiText);
      } catch (error) {
        console.error(
          "GEMINI JSON PARSE ERROR:",
          error
        );

        console.error(
          "GEMINI RESPONSE:",
          aiText
        );

        return res.status(502).json({
          success: false,
          message:
            "Gemini returned invalid question paper data. Please try again.",
        });
      }

      // ======================================
      // PAPER FORMAT CHECK
      // ======================================

      if (
        !paper ||
        typeof paper !== "object" ||
        !Array.isArray(
          paper.questions
        )
      ) {
        return res.status(502).json({
          success: false,
          message:
            "Invalid question paper format returned by Gemini.",
        });
      }

      // ======================================
      // VALIDATE + CLEAN
      // ======================================

      let cleanedQuestions;

      try {
        cleanedQuestions =
          validateAndCleanQuestions(
            paper.questions,
            settings
          );
      } catch (validationError) {
        console.error(
          "AI PAPER VALIDATION ERROR:",
          validationError.message
        );

        return res.status(502).json({
          success: false,
          message:
            validationError.message ||
            "Gemini generated an invalid question paper. Please try again.",
        });
      }

      // ======================================
      // SAVE TO MONGODB
      // ======================================

      const savedPaper =
        await AIPaper.create({
          user: req.user._id,

          title:
            String(
              paper.title ||
                "AI Generated Question Paper"
            ).trim(),

          subject:
            String(
              paper.subject ||
                settings.subject
            ).trim(),

          unit:
            String(
              paper.unit ||
                settings.unit
            ).trim(),

          syllabus:
            settings.syllabus,

          difficulty:
            settings.difficulty,

          questionType:
            settings.questionType,

          questionCount:
            cleanedQuestions.length,

          examPattern:
            settings.examPattern,

          language:
            settings.language,

          totalMarks:
            settings.totalMarks,

          duration:
            settings.duration,

          bloomLevel:
            settings.bloomLevel,

          includeExplanations:
            settings.includeExplanations,

          questions:
            cleanedQuestions,
        });

      // ======================================
      // SUCCESS LOG
      // ======================================

      console.log(
        "================================="
      );

      console.log(
        "ADVANCED GEMINI PAPER SAVED"
      );

      console.log(
        "Paper ID:",
        savedPaper._id
      );

      console.log(
        "User ID:",
        req.user._id
      );

      console.log(
        "Questions:",
        savedPaper.questions.length
      );

      console.log(
        "Total Marks:",
        savedPaper.totalMarks
      );

      console.log(
        "================================="
      );

      // ======================================
      // SEND RESPONSE
      // ======================================

      return res.status(200).json({
        success: true,

        message:
          "Advanced AI question paper generated and saved successfully",

        paper: {
          _id:
            savedPaper._id,

          title:
            savedPaper.title,

          subject:
            savedPaper.subject,

          unit:
            savedPaper.unit,

          syllabus:
            savedPaper.syllabus,

          difficulty:
            savedPaper.difficulty,

          questionType:
            savedPaper.questionType,

          questionCount:
            savedPaper.questionCount,

          examPattern:
            savedPaper.examPattern,

          language:
            savedPaper.language,

          totalMarks:
            savedPaper.totalMarks,

          duration:
            savedPaper.duration,

          bloomLevel:
            savedPaper.bloomLevel,

          includeExplanations:
            savedPaper.includeExplanations,

          questions:
            savedPaper.questions,

          createdAt:
            savedPaper.createdAt,
        },
      });
    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "ADVANCED GEMINI PAPER ERROR:",
        error
      );

      console.error(
        "================================="
      );

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "Failed to generate question paper",
      });
    }
  }
);

// ======================================
// GET MY SAVED AI QUESTION PAPERS
// ======================================

router.get(
  "/my-papers",
  authMiddleware,
  async (req, res) => {
    try {
      const papers =
        await AIPaper.find({
          user: req.user._id,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        count: papers.length,
        papers,
      });
    } catch (error) {
      console.error(
        "GET SAVED PAPERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to load saved question papers",
      });
    }
  }
);

module.exports = router;