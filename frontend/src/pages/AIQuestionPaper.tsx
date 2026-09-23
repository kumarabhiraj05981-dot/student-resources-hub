
import { useState } from "react";

interface Question {
  number: number;
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  marks?: number;
  bloomLevel?: string;
}

interface Paper {
  _id?: string;
  title: string;
  subject: string;
  unit: string;
  syllabus?: string;
  difficulty: string;
  questionType?: string;
  questionCount?: number;
  examPattern?: string;
  language?: string;
  totalMarks?: number;
  duration?: string;
  bloomLevel?: string;
  includeExplanations?: boolean;
  questions: Question[];
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  paper?: Paper;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AIQuestionPaper() {
  // ======================================
  // FORM STATES
  // ======================================

  const [subject, setSubject] = useState("");
  const [syllabus, setSyllabus] = useState("");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [questionCount, setQuestionCount] =
    useState("20");

  const [questionType, setQuestionType] =
    useState("Mixed");

  const [examPattern, setExamPattern] =
    useState("Polytechnic");

  const [language, setLanguage] =
    useState("English");

  const [totalMarks, setTotalMarks] =
    useState("100");

  const [duration, setDuration] =
    useState("2 Hours");

  const [bloomLevel, setBloomLevel] =
    useState("Mixed");

  const [includeExplanations, setIncludeExplanations] =
    useState(true);

  // ======================================
  // UI STATES
  // ======================================

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<ApiResponse | null>(null);

  const [error, setError] =
    useState("");

  // ======================================
  // GENERATE PAPER
  // ======================================

  const handleGenerate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      // ------------------------------------
      // VALIDATION
      // ------------------------------------

      if (!subject.trim()) {
        throw new Error(
          "Please enter a subject name."
        );
      }

      if (!syllabus.trim()) {
        throw new Error(
          "Please enter or paste your syllabus / topics."
        );
      }

      const count = Number(questionCount);
      const marks = Number(totalMarks);

      if (count < 1 || count > 100) {
        throw new Error(
          "Question count must be between 1 and 100."
        );
      }

      if (marks < 1 || marks > 1000) {
        throw new Error(
          "Total marks must be between 1 and 1000."
        );
      }

      // ------------------------------------
      // TOKEN
      // ------------------------------------

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login first to generate and save question papers."
        );
      }

      // ------------------------------------
      // API URL
      // ------------------------------------

      if (!API_URL) {
        throw new Error(
          "Backend API URL is not configured."
        );
      }

      console.log(
        "AI API:",
        `${API_URL}/api/ai/generate-paper`
      );

      // ------------------------------------
      // REQUEST
      // ------------------------------------

      const response = await fetch(
        `${API_URL}/api/ai/generate-paper`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            subject: subject.trim(),

            syllabus:
              syllabus.trim(),

            unit:
              syllabus.trim(),

            difficulty,

            questionCount:
              count,

            questionType,

            examPattern,

            language,

            totalMarks:
              marks,

            duration,

            bloomLevel,

            includeExplanations,
          }),
        }
      );

      // ------------------------------------
      // RESPONSE
      // ------------------------------------

      let data: ApiResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          `Server returned an invalid response. Status: ${response.status}`
        );
      }

      console.log(
        "AI PAPER RESPONSE:",
        data
      );

      // ------------------------------------
      // AUTH ERROR
      // ------------------------------------

      if (response.status === 401) {
        localStorage.removeItem("token");

        throw new Error(
          data.message ||
            "Your login session has expired. Please login again."
        );
      }

      // ------------------------------------
      // API ERROR
      // ------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to generate question paper. Server status: ${response.status}`
        );
      }

      // ------------------------------------
      // SUCCESS
      // ------------------------------------

      if (!data.success) {
        throw new Error(
          data.message ||
            "Question paper generation failed."
        );
      }

      if (!data.paper) {
        throw new Error(
          "Question paper was not returned by the server."
        );
      }

      setResult(data);
    } catch (err) {
      console.error(
        "AI Paper Error:",
        err
      );

      if (
        err instanceof TypeError
      ) {
        setError(
          "Unable to connect to backend server. Please check the backend."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate question paper."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // PRINT
  // ======================================

  const handlePrint = () => {
    window.print();
  };

  // ======================================
  // CLEAR
  // ======================================

  const handleClear = () => {
    setSubject("");
    setSyllabus("");
    setDifficulty("Medium");
    setQuestionCount("20");
    setQuestionType("Mixed");
    setExamPattern("Polytechnic");
    setLanguage("English");
    setTotalMarks("100");
    setDuration("2 Hours");
    setBloomLevel("Mixed");
    setIncludeExplanations(true);
    setResult(null);
    setError("");
  };

  // ======================================
  // GENERATE ANOTHER
  // ======================================

  const handleGenerateAnother = () => {
    setResult(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold mb-4">
            <span>AI</span>
            <span>Powered Learning</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
            AI Question Paper Generator
          </h1>

          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Create customized examination papers using
            syllabus, difficulty, marks, language and
            Bloom&apos;s Taxonomy settings.
          </p>

        </div>

        {/* ======================================
            FORM CARD
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

          <form
            onSubmit={handleGenerate}
            className="space-y-6"
          >

            {/* SUBJECT */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Subject Name
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                placeholder="Example: Data Communication, AI, DBMS, Java"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* SYLLABUS */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Syllabus / Units / Topics
              </label>

              <textarea
                value={syllabus}
                onChange={(e) =>
                  setSyllabus(e.target.value)
                }
                placeholder={`Paste your complete syllabus here...

Example:

Unit 1: Introduction to AI
- AI concepts
- Intelligent agents
- Knowledge representation

Unit 2: Problem Solving
- BFS
- DFS
- Best First Search
- A* Search

Unit 3: Applications
- Expert systems
- NLP
- Computer Vision`}
                required
                rows={12}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />

              <p className="text-sm text-gray-500 mt-2">
                The AI will generate questions based on
                the topics you provide.
              </p>

            </div>

            {/* SETTINGS GRID */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* EXAM PATTERN */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Exam Pattern
                </label>

                <select
                  value={examPattern}
                  onChange={(e) =>
                    setExamPattern(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Polytechnic">
                    Polytechnic
                  </option>

                  <option value="College">
                    College
                  </option>

                  <option value="University">
                    University
                  </option>

                  <option value="Competitive Exam">
                    Competitive Exam
                  </option>

                  <option value="Custom">
                    Custom
                  </option>
                </select>

              </div>

              {/* DIFFICULTY */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">
                    Easy
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Hard">
                    Hard
                  </option>
                </select>

              </div>

              {/* QUESTION TYPE */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Question Type
                </label>

                <select
                  value={questionType}
                  onChange={(e) =>
                    setQuestionType(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mixed">
                    Mixed
                  </option>

                  <option value="MCQ">
                    MCQ
                  </option>

                  <option value="Short Answer">
                    Short Answer
                  </option>

                  <option value="Long Answer">
                    Long Answer
                  </option>
                </select>

              </div>

              {/* LANGUAGE */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Language
                </label>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Hindi">
                    Hindi
                  </option>

                  <option value="Hinglish">
                    Hinglish
                  </option>
                </select>

              </div>

              {/* QUESTION COUNT */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Questions
                </label>

                <select
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">
                    5 Questions
                  </option>

                  <option value="10">
                    10 Questions
                  </option>

                  <option value="20">
                    20 Questions
                  </option>

                  <option value="30">
                    30 Questions
                  </option>

                  <option value="50">
                    50 Questions
                  </option>

                  <option value="100">
                    100 Questions
                  </option>
                </select>

              </div>

              {/* TOTAL MARKS */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Total Marks
                </label>

                <select
                  value={totalMarks}
                  onChange={(e) =>
                    setTotalMarks(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="20">
                    20 Marks
                  </option>

                  <option value="30">
                    30 Marks
                  </option>

                  <option value="50">
                    50 Marks
                  </option>

                  <option value="70">
                    70 Marks
                  </option>

                  <option value="100">
                    100 Marks
                  </option>

                  <option value="150">
                    150 Marks
                  </option>

                  <option value="200">
                    200 Marks
                  </option>
                </select>

              </div>

              {/* DURATION */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Duration
                </label>

                <select
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30 Minutes">
                    30 Minutes
                  </option>

                  <option value="1 Hour">
                    1 Hour
                  </option>

                  <option value="2 Hours">
                    2 Hours
                  </option>

                  <option value="3 Hours">
                    3 Hours
                  </option>

                  <option value="4 Hours">
                    4 Hours
                  </option>
                </select>

              </div>

              {/* BLOOM LEVEL */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Bloom&apos;s Taxonomy
                </label>

                <select
                  value={bloomLevel}
                  onChange={(e) =>
                    setBloomLevel(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mixed">
                    Mixed
                  </option>

                  <option value="Remember">
                    Remember
                  </option>

                  <option value="Understand">
                    Understand
                  </option>

                  <option value="Apply">
                    Apply
                  </option>

                  <option value="Analyze">
                    Analyze
                  </option>

                  <option value="Evaluate">
                    Evaluate
                  </option>

                  <option value="Create">
                    Create
                  </option>
                </select>

              </div>

            </div>

            {/* EXPLANATION TOGGLE */}

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={includeExplanations}
                  onChange={(e) =>
                    setIncludeExplanations(
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 accent-blue-600"
                />

                <div>

                  <p className="font-semibold text-gray-800">
                    Include Answer Explanations
                  </p>

                  <p className="text-sm text-gray-500">
                    AI will provide a short explanation
                    for each answer.
                  </p>

                </div>

              </label>

            </div>

            {/* GENERATE BUTTONS */}

            <div className="flex flex-col md:flex-row gap-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-lg transition"
              >
                {loading
                  ? "Generating Question Paper..."
                  : "Generate Question Paper"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="md:w-32 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-bold py-4 rounded-lg transition"
              >
                Clear
              </button>

            </div>

          </form>

          {/* ERROR */}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <strong>Error:</strong>{" "}
              {error}
            </div>
          )}

        </div>

        {/* ======================================
            GENERATED PAPER
        ====================================== */}

        {result?.success &&
          result.paper && (

          <div
            id="generated-paper"
            className="mt-10"
          >

            {/* PAPER HEADER */}

            <div className="bg-blue-700 text-white rounded-t-2xl p-6">

              <div className="flex flex-col md:flex-row justify-between gap-6">

                <div>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    {result.paper.title}
                  </h2>

                  <p className="mt-2 text-blue-100">
                    Subject: {result.paper.subject}
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:text-right">

                  <p>
                    <strong>Pattern:</strong>{" "}
                    {result.paper.examPattern ||
                      "General"}
                  </p>

                  <p>
                    <strong>Difficulty:</strong>{" "}
                    {result.paper.difficulty}
                  </p>

                  <p>
                    <strong>Questions:</strong>{" "}
                    {result.paper.questions.length}
                  </p>

                  <p>
                    <strong>Total Marks:</strong>{" "}
                    {result.paper.totalMarks || "-"}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {result.paper.duration || "-"}
                  </p>

                  <p>
                    <strong>Language:</strong>{" "}
                    {result.paper.language || "-"}
                  </p>

                </div>

              </div>

            </div>

            {/* PAPER META */}

            <div className="bg-white border-x border-gray-200 px-6 py-5">

              <div className="flex flex-wrap gap-3">

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Type:{" "}
                  {result.paper.questionType ||
                    "Mixed"}
                </span>

                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Bloom:{" "}
                  {result.paper.bloomLevel ||
                    "Mixed"}
                </span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Marks:{" "}
                  {result.paper.totalMarks || "-"}
                </span>

                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Time:{" "}
                  {result.paper.duration || "-"}
                </span>

              </div>

            </div>

            {/* QUESTIONS */}

            <div className="bg-white border border-gray-200 rounded-b-2xl">

              {result.paper.questions.map(
                (q, index) => (

                <div
                  key={`${q.number}-${index}`}
                  className="p-6 border-b border-gray-200 last:border-b-0"
                >

                  <div className="flex gap-4">

                    {/* NUMBER */}

                    <span className="flex-shrink-0 bg-blue-100 text-blue-700 font-bold w-10 h-10 rounded-full flex items-center justify-center">
                      {q.number || index + 1}
                    </span>

                    <div className="flex-1">

                      {/* TYPE + MARKS */}

                      <div className="flex flex-wrap gap-2 mb-3">

                        <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {q.type}
                        </span>

                        {q.marks !== undefined && (
                          <span className="inline-block text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                            {q.marks}{" "}
                            Mark
                            {q.marks > 1
                              ? "s"
                              : ""}
                          </span>
                        )}

                        {q.bloomLevel && (
                          <span className="inline-block text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            {q.bloomLevel}
                          </span>
                        )}

                      </div>

                      {/* QUESTION */}

                      <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
                        {q.question}
                      </h3>

                      {/* MCQ OPTIONS */}

                      {q.options &&
                        q.options.length > 0 && (

                        <div className="grid md:grid-cols-2 gap-3 mt-4">

                          {q.options.map(
                            (
                              option,
                              optionIndex
                            ) => (

                            <div
                              key={optionIndex}
                              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                            >

                              <span className="font-bold text-blue-600 mr-2">
                                {String.fromCharCode(
                                  65 +
                                    optionIndex
                                )}
                                .
                              </span>

                              {option}

                            </div>

                          ))}
                        </div>
                      )}

                      {/* ANSWER */}

                      <details className="mt-5">

                        <summary className="cursor-pointer inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                          Show Answer
                        </summary>

                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">

                          <strong>
                            Answer:
                          </strong>{" "}

                          {q.answer}

                        </div>

                      </details>

                      {/* EXPLANATION */}

                      {q.explanation && (

                        <details className="mt-3">

                          <summary className="cursor-pointer inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                            Show Explanation
                          </summary>

                          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">

                            <strong>
                              Explanation:
                            </strong>{" "}

                            {q.explanation}

                          </div>

                        </details>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* PAPER ACTIONS */}

            <div className="mt-6 flex flex-col md:flex-row gap-4">

              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition no-print"
              >
                Print / Save as PDF
              </button>

              <button
                type="button"
                onClick={handleGenerateAnother}
                className="md:w-56 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 rounded-lg transition no-print"
              >
                Generate Another
              </button>

            </div>

            {/* SUCCESS */}

            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center font-semibold no-print">
              Question paper generated and saved successfully!
            </div>

          </div>
        )}

        {/* ======================================
            FEATURES
        ====================================== */}

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <div className="text-3xl mb-3">
              AI
            </div>

            <h3 className="font-bold text-gray-800">
              Smart Generation
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Generate customized papers according
              to your syllabus and exam requirements.
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <div className="text-3xl mb-3">
              B
            </div>

            <h3 className="font-bold text-gray-800">
              Bloom&apos;s Taxonomy
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Create questions focused on different
              learning and thinking levels.
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <div className="text-3xl mb-3">
              ✓
            </div>

            <h3 className="font-bold text-gray-800">
              Complete Assessment
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Get questions, marks, answers,
              explanations and difficulty settings.
            </p>

          </div>

        </div>

        {/* ======================================
            HOW TO USE
        ====================================== */}

        <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800 text-center">
            How to Use AI Question Generator
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-8">

            <div className="text-center">

              <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>

              <h3 className="font-bold mt-3">
                Enter Subject
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Enter your subject name.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>

              <h3 className="font-bold mt-3">
                Add Syllabus
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Paste units and important topics.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>

              <h3 className="font-bold mt-3">
                Configure
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Choose pattern, marks, language
                and difficulty.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>

              <h3 className="font-bold mt-3">
                Generate
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Let AI create your paper.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          PRINT CSS
      ====================================== */}

      <style>
        {`
          @media print {

            body {
              background: white !important;
            }

            form,
            .no-print {
              display: none !important;
            }

            #generated-paper {
              margin: 0 !important;
              padding: 0 !important;
            }

            button {
              display: none !important;
            }

            details {
              display: block !important;
            }

            details summary {
              display: none !important;
            }

            details > div {
              display: block !important;
            }

            @page {
              margin: 15mm;
            }
          }
        `}
      </style>

    </div>
  );
}