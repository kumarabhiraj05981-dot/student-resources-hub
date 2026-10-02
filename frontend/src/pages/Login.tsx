import {
  useState,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        email: cleanEmail,
        password,
      });

      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Login failed."
        );
      }

      if (!res.data?.token) {
        throw new Error(
          "Login successful but authentication token was not received."
        );
      }

      const user: User = res.data.user || {};

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      /*
       * Keep remember-me preference available
       * for future authentication improvements.
       */
      localStorage.setItem(
        "rememberMe",
        String(rememberMe)
      );

      window.dispatchEvent(
        new Event("auth-change")
      );

      navigate("/", {
        replace: true,
      });
    } catch (err: any) {
      console.error(
        "LOGIN ERROR:",
        err.response?.data || err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT BRAND PANEL */}
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/10" />

            <div className="relative z-10">

              {/* LOGO */}
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-blue-700 shadow-lg">
                  SR
                </div>

                <div>
                  <div className="text-base font-extrabold">
                    Student Resources
                  </div>

                  <div className="text-xs font-medium text-blue-100">
                    Study smarter. Prepare better.
                  </div>
                </div>
              </Link>

              <div className="mt-20 max-w-md">

                <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-50">
                  Student Resources Hub
                </div>

                <h1 className="text-4xl font-black leading-tight xl:text-5xl">
                  Everything you need to
                  <span className="block text-blue-200">
                    study better.
                  </span>
                </h1>

                <p className="mt-6 text-base leading-7 text-blue-100">
                  Access notes, previous year questions,
                  syllabus, e-books, AI study tools and
                  your personalized study resources from
                  one place.
                </p>
              </div>
            </div>

            {/* FEATURES */}
            <div className="relative z-10 mt-12 space-y-3">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 font-bold">
                  ✓
                </span>

                <span className="text-sm font-semibold text-blue-50">
                  Notes & study materials
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 font-bold">
                  ✓
                </span>

                <span className="text-sm font-semibold text-blue-50">
                  PYQs & syllabus resources
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 font-bold">
                  ✓
                </span>

                <span className="text-sm font-semibold text-blue-50">
                  AI-powered study tools
                </span>
              </div>

            </div>
          </section>

          {/* RIGHT LOGIN PANEL */}
          <section className="bg-white p-6 sm:p-9 md:p-12">

            {/* MOBILE BRAND */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white shadow-md">
                SR
              </div>

              <div>
                <div className="text-base font-extrabold text-gray-900">
                  Student Resources
                </div>

                <div className="text-xs font-medium text-gray-500">
                  Study smarter. Prepare better.
                </div>
              </div>

            </div>

            {/* HEADING */}
            <div className="mb-8">

              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700">
                Welcome back
              </div>

              <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Continue your learning journey with
                Student Resources Hub.
              </p>

            </div>

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5"
              >
                <div className="flex items-start gap-3">

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                    !
                  </span>

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Login failed
                    </p>

                    <p className="mt-0.5 text-sm text-red-600">
                      {error}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-gray-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="text-xs font-bold text-blue-600 transition hover:text-blue-800"
                  >
                    {showPassword
                      ? "Hide password"
                      : "Show password"}
                  </button>

                </div>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    •••
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />

                </div>

              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center justify-between gap-4">

                <label className="flex cursor-pointer items-center gap-2.5">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm font-medium text-gray-600">
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Password reset is not available yet."
                    )
                  }
                  className="text-sm font-bold text-blue-600 transition hover:text-blue-800"
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-base font-extrabold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span>→</span>
                  </>
                )}

              </button>

            </form>

            {/* REGISTER DIVIDER */}
            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-semibold text-gray-400">
                NEW HERE?
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>

            {/* REGISTER */}
            <Link
              to="/register"
              className="flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white py-3.5 text-sm font-extrabold text-gray-700 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Create New Account
            </Link>

            {/* BACK HOME */}
            <Link
              to="/"
              className="mt-5 block text-center text-sm font-semibold text-gray-500 transition hover:text-blue-600"
            >
              ← Back to Student Resources Hub
            </Link>

            {/* FOOTER */}
            <p className="mt-8 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Student Resources Hub
            </p>

          </section>
        </div>
      </div>
    </main>
  );
}