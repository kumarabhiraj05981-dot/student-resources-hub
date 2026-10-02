import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What does LAN stand for?",
    options: [
      "Local Area Network",
      "Large Area Network",
      "Long Area Network",
      "Local Access Network",
    ],
    answer: "Local Area Network",
  },
  {
    id: 2,
    question: "Which device connects different networks?",
    options: [
      "Switch",
      "Router",
      "Keyboard",
      "Monitor",
    ],
    answer: "Router",
  },
  {
    id: 3,
    question: "Which protocol is used for secure web communication?",
    options: [
      "HTTP",
      "FTP",
      "HTTPS",
      "SMTP",
    ],
    answer: "HTTPS",
  },
  {
    id: 4,
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Processing User",
      "Central Program Utility",
      "Computer Program Unit",
    ],
    answer: "Central Processing Unit",
  },
  {
    id: 5,
    question: "Which language is mainly used to structure web pages?",
    options: [
      "CSS",
      "HTML",
      "Python",
      "SQL",
    ],
    answer: "HTML",
  },
  {
    id: 6,
    question: "Which language is used to style web pages?",
    options: [
      "HTML",
      "CSS",
      "C++",
      "Java",
    ],
    answer: "CSS",
  },
  {
    id: 7,
    question: "Which database is used in your Student Resources Hub backend?",
    options: [
      "MySQL",
      "MongoDB",
      "Oracle",
      "SQLite",
    ],
    answer: "MongoDB",
  },
  {
    id: 8,
    question: "What does DBMS stand for?",
    options: [
      "Database Management System",
      "Data Backup Management Service",
      "Database Memory System",
      "Data Management Software",
    ],
    answer: "Database Management System",
  },
  {
    id: 9,
    question: "Which data structure follows FIFO?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Graph",
    ],
    answer: "Queue",
  },
  {
    id: 10,
    question: "Which data structure follows LIFO?",
    options: [
      "Queue",
      "Array",
      "Stack",
      "Linked List",
    ],
    answer: "Stack",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];

  const score = useMemo(() => {
    return questions.reduce((total, item) => {
      return total + (answers[item.id] === item.answer ? 1 : 0);
    }, 0);
  }, [answers]);

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer first.");
      return;
    }

    const updatedAnswers = {
      ...answers,
      [question.id]: selectedAnswer,
    };

    setAnswers(updatedAnswers);

    if (currentQuestion === questions.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);

    const nextAnswer =
      updatedAnswers[questions[currentQuestion + 1].id] || "";

    setSelectedAnswer(nextAnswer);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers({});
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 sm:p-10 text-center shadow-xl">

            <div className="text-6xl mb-5">
              🎉
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Quiz Completed!
            </h1>

            <p className="mt-3 text-gray-600">
              Great job! Here is your result.
            </p>

            <div className="mt-8 rounded-2xl bg-blue-50 p-6">
              <p className="text-sm text-gray-500">
                Your Score
              </p>

              <p className="mt-2 text-5xl font-bold text-blue-600">
                {score}/{questions.length}
              </p>

              <p className="mt-2 text-xl font-semibold text-gray-700">
                {percentage}%
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
              >
                🔄 Try Again
              </button>

              <Link
                to="/"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                🏠 Go Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">
              📝
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Student Quiz
            </h1>

            <p className="mt-2 text-gray-600">
              Test your technical knowledge
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mb-5">
            <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
              <span>
                Question {currentQuestion + 1}
              </span>

              <span>
                {questions.length} Questions
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      questions.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl">

            <p className="text-sm font-semibold text-blue-600">
              Question {currentQuestion + 1}
            </p>

            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-gray-800">
              {question.question}
            </h2>

            {/* OPTIONS */}
            <div className="mt-7 space-y-3">
              {question.options.map((option) => {
                const selected =
                  selectedAnswer === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setSelectedAnswer(option)
                    }
                    className={`w-full text-left rounded-xl border-2 p-4 transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {selected ? "✓" : ""}
                      </span>

                      <span className="font-medium">
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* NEXT BUTTON */}
            <button
              type="button"
              onClick={handleNext}
              className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-700 transition"
            >
              {currentQuestion === questions.length - 1
                ? "Submit Quiz 🎯"
                : "Next Question →"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}