import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

interface StudyTopic {
  id: number;
  subject: string;
  topic: string;
  examDate: string;
  hours: number;
  completed: boolean;
}

const STORAGE_KEY = "student_resources_study_planner";

export default function StudyPlanner() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("2");
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed"
  >("all");

  // Important: prevents empty initial state from overwriting localStorage
  const [loaded, setLoaded] = useState(false);

  // Load saved topics
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setTopics(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load study planner data:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save topics only after initial data has been loaded
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  }, [topics, loaded]);

  const addTopic = () => {
    const cleanSubject = subject.trim();
    const cleanTopic = topic.trim();

    if (!cleanSubject || !cleanTopic) {
      return;
    }

    const newTopic: StudyTopic = {
      id: Date.now(),
      subject: cleanSubject,
      topic: cleanTopic,
      examDate,
      hours: Number(hours) || 1,
      completed: false,
    };

    setTopics((current) => [newTopic, ...current]);

    setSubject("");
    setTopic("");
    setExamDate("");
    setHours("2");
  };

  const toggleComplete = (id: number) => {
    setTopics((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    );
  };

  const deleteTopic = (id: number) => {
    setTopics((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const clearCompleted = () => {
    setTopics((current) =>
      current.filter((item) => !item.completed)
    );
  };

  const clearAll = () => {
    setTopics([]);
  };

  const completedCount = topics.filter(
    (item) => item.completed
  ).length;

  const progress =
    topics.length === 0
      ? 0
      : Math.round(
          (completedCount / topics.length) * 100
        );

  const filteredTopics = useMemo(() => {
    if (filter === "completed") {
      return topics.filter((item) => item.completed);
    }

    if (filter === "pending") {
      return topics.filter((item) => !item.completed);
    }

    return topics;
  }, [topics, filter]);

  const getDaysLeft = (date: string) => {
    if (!date) return null;

    const today = new Date();
    const exam = new Date(`${date}T23:59:59`);

    const difference =
      exam.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-6">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <header className="mb-8 text-center">
            <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
              Smart Study Planning
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              Study Planner
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Plan your subjects, track topics, and stay
              consistent with your exam preparation.
            </p>
          </header>

          {/* Stats */}
          <section className="mb-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total Topics
              </p>

              <p className="mt-2 text-3xl font-extrabold text-gray-900">
                {topics.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-extrabold text-green-600">
                {completedCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Progress
              </p>

              <p className="mt-2 text-3xl font-extrabold text-indigo-600">
                {progress}%
              </p>
            </div>

          </section>

          {/* Progress Bar */}
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                Overall Progress
              </span>

              <span className="text-sm font-bold text-indigo-600">
                {progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </section>

          {/* Add Topic */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">

            <h2 className="text-2xl font-bold text-gray-900">
              Add Study Topic
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add the topics you want to complete before
              your exam.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject
                </label>

                <input
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  placeholder="e.g. DBMS"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Topic
                </label>

                <input
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  placeholder="e.g. Normalization"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Exam Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Exam / Target Date
                </label>

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) =>
                    setExamDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Daily Hours */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Daily Study Hours
                </label>

                <input
                  type="number"
                  min="1"
                  max="24"
                  value={hours}
                  onChange={(e) =>
                    setHours(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

            </div>

            <button
              type="button"
              onClick={addTopic}
              disabled={
                !subject.trim() ||
                !topic.trim()
              }
              className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add Topic
            </button>

          </section>

          {/* Topic List */}
          <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  My Study Topics
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Mark topics complete as you finish them.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">

                {(
                  [
                    "all",
                    "pending",
                    "completed",
                  ] as const
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setFilter(item)
                    }
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      filter === item
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item.charAt(0).toUpperCase() +
                      item.slice(1)}
                  </button>
                ))}

              </div>

            </div>

            {/* Empty State */}
            {filteredTopics.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-12 text-center">

                <div className="text-4xl">
                  📚
                </div>

                <h3 className="mt-3 font-bold text-gray-800">
                  No topics found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {topics.length === 0
                    ? "Add your first study topic above."
                    : "No topics match the selected filter."}
                </p>

              </div>
            ) : (

              <div className="mt-6 space-y-3">

                {filteredTopics.map((item) => {
                  const daysLeft =
                    getDaysLeft(item.examDate);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 transition ${
                        item.completed
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-center">

                        {/* Complete Button */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleComplete(item.id)
                          }
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-bold transition ${
                            item.completed
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 bg-white text-transparent hover:border-indigo-400"
                          }`}
                          aria-label={
                            item.completed
                              ? "Mark as incomplete"
                              : "Mark as complete"
                          }
                        >
                          ✓
                        </button>

                        {/* Topic Info */}
                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                              {item.subject}
                            </span>

                            {item.completed && (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                Completed
                              </span>
                            )}

                          </div>

                          <h3
                            className={`mt-2 text-lg font-bold ${
                              item.completed
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {item.topic}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">

                            <span>
                              ⏱ {item.hours} hr/day
                            </span>

                            {item.examDate && (
                              <span>
                                📅 Exam:{" "}
                                {new Date(
                                  `${item.examDate}T00:00:00`
                                ).toLocaleDateString()}
                              </span>
                            )}

                            {daysLeft !== null && (
                              <span
                                className={
                                  daysLeft < 0
                                    ? "font-bold text-red-600"
                                    : daysLeft <= 7
                                      ? "font-bold text-orange-600"
                                      : ""
                                }
                              >
                                {daysLeft < 0
                                  ? "Exam date passed"
                                  : daysLeft === 0
                                    ? "Exam is today"
                                    : `${daysLeft} day${
                                        daysLeft === 1
                                          ? ""
                                          : "s"
                                      } left`}
                              </span>
                            )}

                          </div>

                        </div>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            deleteTopic(item.id)
                          }
                          className="rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

            {/* Bottom Actions */}
            {topics.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={clearCompleted}
                  disabled={completedCount === 0}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear Completed
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Clear All
                </button>

              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}