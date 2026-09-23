
import { useEffect, useState, type FormEvent } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SavedConversation {
  id: string;
  question: string;
  answer: string;
  subject: string;
  language: string;
  createdAt: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const HISTORY_KEY = "student_resources_ai_history";

const starterPrompts = [
  "Explain this topic in simple language",
  "Give me an exam-focused revision summary",
  "Explain with a practical example",
];

export default function StudyAssistant() {
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("English");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState<SavedConversation[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // ==========================================
  // LOAD SAVED AI HISTORY
  // ==========================================
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);

        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (err) {
      console.error("AI history load error:", err);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  // ==========================================
  // SAVE AI HISTORY
  // IMPORTANT:
  // Do not save until initial history is loaded.
  // This prevents refresh from clearing history.
  // ==========================================
  useEffect(() => {
    if (!historyLoaded) return;

    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
      );
    } catch (err) {
      console.error("AI history save error:", err);
    }
  }, [history, historyLoaded]);

  // ==========================================
  // SEND MESSAGE TO AI
  // ==========================================
  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login first to use the AI Study Assistant."
      );
      return;
    }

    setError("");
    setMessage("");

    // Add user message immediately
    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: text,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/study-assistant`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: text,
            subject,
            language,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");

        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to get an AI response."
        );
      }

      const answer = data.answer;

      // Add AI answer to chat
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
        },
      ]);

      // ==========================================
      // SAVE QUESTION + ANSWER TO HISTORY
      // ==========================================
      const newConversation: SavedConversation = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`,
        question: text,
        answer,
        subject: subject.trim(),
        language,
        createdAt: new Date().toISOString(),
      };

      setHistory((current) => [
        newConversation,
        ...current,
      ]);
    } catch (err) {
      console.error("AI Study Assistant error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the AI assistant."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR CURRENT CHAT
  // ==========================================
  const clearChat = () => {
    setMessages([]);
    setError("");
    setMessage("");
  };

  // ==========================================
  // DELETE ONE HISTORY ITEM
  // ==========================================
  const deleteHistoryItem = (id: string) => {
    setHistory((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  // ==========================================
  // CLEAR ALL HISTORY
  // ==========================================
  const clearAllHistory = () => {
    if (!history.length) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all AI history?"
    );

    if (!confirmed) return;

    setHistory([]);
  };

  // ==========================================
  // VIEW OLD CONVERSATION
  // ==========================================
  const viewHistoryItem = (
    conversation: SavedConversation
  ) => {
    setSubject(conversation.subject);
    setLanguage(conversation.language);

    setMessages([
      {
        role: "user",
        content: conversation.question,
      },
      {
        role: "assistant",
        content: conversation.answer,
      },
    ]);

    setError("");
    setShowHistory(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">

        {/* ======================================
            HEADER
        ====================================== */}
        <header className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
            AI Powered Learning
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            AI Study Assistant
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Ask doubts, simplify difficult topics, create quick
            revision notes, and prepare smarter for exams.
          </p>
        </header>

        {/* ======================================
            MAIN CARD
        ====================================== */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">

          {/* ====================================
              SETTINGS
          ==================================== */}
          <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Subject (optional)
              </label>

              <input
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                placeholder="e.g. DBMS, Java, Electrical Machines"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Language
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearChat}
                disabled={
                  !messages.length && !error
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear Chat
              </button>
            </div>

          </div>

          {/* ====================================
              STARTER PROMPTS
          ==================================== */}
          {messages.length === 0 && (
            <div className="mt-7 rounded-2xl bg-slate-50 p-5">

              <p className="font-bold text-gray-800">
                Try asking:
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() =>
                      setMessage(`${prompt}: `)
                    }
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {prompt}
                  </button>
                ))}

              </div>
            </div>
          )}

          {/* ====================================
              CHAT
          ==================================== */}
          <div className="mt-7 space-y-4">

            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-6 md:max-w-[80%] ${
                    item.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-800"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-500">
                AI is thinking...
              </div>
            )}

          </div>

          {/* ====================================
              ERROR
          ==================================== */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* ====================================
              INPUT
          ==================================== */}
          <form
            onSubmit={sendMessage}
            className="mt-7"
          >

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your question
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Ask anything about your subject..."
                rows={3}
                maxLength={4000}
                className="min-h-24 flex-1 resize-y rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="submit"
                disabled={
                  loading || !message.trim()
                }
                className="rounded-2xl bg-indigo-600 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
              >
                {loading
                  ? "Thinking..."
                  : "Ask AI"}
              </button>

            </div>

            <p className="mt-2 text-xs text-gray-500">
              AI can make mistakes. Verify important academic
              answers with your course material.
            </p>

          </form>

          {/* ====================================
              AI HISTORY BUTTON
          ==================================== */}
          <div className="mt-8 border-t border-gray-200 pt-6">

            <button
              type="button"
              onClick={() =>
                setShowHistory((current) => !current)
              }
              className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-left transition hover:bg-gray-100"
            >
              <div>
                <p className="font-bold text-gray-900">
                  AI History
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {history.length === 0
                    ? "No saved conversations yet"
                    : `${history.length} saved conversation${
                        history.length === 1
                          ? ""
                          : "s"
                      }`}
                </p>
              </div>

              <span className="text-xl text-gray-500">
                {showHistory ? "▲" : "▼"}
              </span>
            </button>

            {/* ==================================
                HISTORY PANEL
            ================================== */}
            {showHistory && (
              <div className="mt-4">

                {history.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                    <div className="text-4xl">
                      
                    </div>

                    <h3 className="mt-3 font-bold text-gray-800">
                      No AI History Yet
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Ask the AI a question and your
                      answer will automatically appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* CLEAR ALL */}
                    <div className="mb-4 flex justify-end">
                      <button
                        type="button"
                        onClick={clearAllHistory}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete All History
                      </button>
                    </div>

                    {/* HISTORY LIST */}
                    <div className="space-y-4">

                      {history.map(
                        (conversation) => (
                          <article
                            key={conversation.id}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                          >

                            {/* QUESTION */}
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                                Question
                              </p>

                              <p className="mt-2 whitespace-pre-wrap font-semibold text-gray-900">
                                {conversation.question}
                              </p>
                            </div>

                            {/* ANSWER */}
                            <div className="mt-5 rounded-xl bg-slate-50 p-4">
                              <p className="text-xs font-bold uppercase tracking-wide text-green-600">
                                AI Answer
                              </p>

                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                {conversation.answer}
                              </p>
                            </div>

                            {/* DETAILS */}
                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">

                              {conversation.subject && (
                                <span className="rounded-full bg-indigo-50 px-3 py-1">
                                  Subject:{" "}
                                  {conversation.subject}
                                </span>
                              )}

                              <span className="rounded-full bg-gray-100 px-3 py-1">
                                Language:{" "}
                                {conversation.language}
                              </span>

                              <span className="rounded-full bg-gray-100 px-3 py-1">
                                {formatDate(
                                  conversation.createdAt
                                )}
                              </span>

                            </div>

                            {/* ACTIONS */}
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                              <button
                                type="button"
                                onClick={() =>
                                  viewHistoryItem(
                                    conversation
                                  )
                                }
                                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                              >
                                👁 View
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteHistoryItem(
                                    conversation.id
                                  )
                                }
                                className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                              >
                                🗑 Delete
                              </button>

                            </div>

                          </article>
                        )
                      )}

                    </div>
                  </>
                )}

              </div>
            )}

          </div>

        </section>
      </div>
    </main>
  );
}

