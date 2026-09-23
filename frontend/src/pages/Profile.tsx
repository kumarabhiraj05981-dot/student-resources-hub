import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../services/api";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  branch?: string;
  semester?: string;
  createdAt?: string;
}

interface ProfileResponse {
  success: boolean;
  user: User;
  message?: string;
}

const BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

export default function Profile() {
  const [user, setUser] = useState<User>({});

  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<ProfileResponse>(
          "/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileUser = response.data.user;

        setUser(profileUser);

        setName(profileUser.name || "");
        setBranch(profileUser.branch || "");
        setSemester(profileUser.semester || "");

        localStorage.setItem(
          "user",
          JSON.stringify(profileUser)
        );
      } catch (error: any) {
        console.error(
          "Profile loading error:",
          error
        );

        setProfileError(
          error.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleProfileUpdate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setProfileError("Please login first.");
      return;
    }

    if (!name.trim()) {
      setProfileError("Name is required.");
      return;
    }

    try {
      setSavingProfile(true);

      setProfileMessage("");
      setProfileError("");

      const response = await api.put<ProfileResponse>(
        "/api/auth/profile",
        {
          name: name.trim(),
          branch: branch.trim(),
          semester: semester.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setName(updatedUser.name || "");
      setBranch(updatedUser.branch || "");
      setSemester(updatedUser.semester || "");

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setProfileMessage(
        response.data.message ||
          "Profile updated successfully."
      );
    } catch (error: any) {
      console.error(
        "Profile update error:",
        error
      );

      setProfileError(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handlePasswordChange = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setPasswordError("Please login first.");
      return;
    }

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      setPasswordMessage("");
      setPasswordError("");

      const response = await api.put(
        "/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordMessage(
        response.data?.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(
        "Password change error:",
        error
      );

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // DISPLAY DATA
  // ==========================================

  const displayName =
    user.name?.trim() ||
    user.email?.split("@")[0] ||
    "Student";

  const firstLetter = displayName
    .charAt(0)
    .toUpperCase();

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!localStorage.getItem("token")) {
    return (
      <div className="flex min-h-screen flex-col bg-blue-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="text-5xl">🔐</div>

            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              Login Required
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Please login to view and manage your
              profile.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // MAIN PROFILE PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl">

          {/* ========================================
              HEADER
          ======================================== */}

          <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 text-white shadow-xl sm:p-8">
            <p className="text-sm font-medium text-blue-100">
              Account Settings
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
              Manage your personal information,
              academic details and account security.
            </p>
          </section>

          {/* ========================================
              LOADING
          ======================================== */}

          {loading ? (
            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-lg">
              <div className="text-4xl">
                ⏳
              </div>

              <p className="mt-3 font-medium text-gray-600">
                Loading profile...
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* ======================================
                  PROFILE CARD
              ====================================== */}

              <section className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex flex-col items-center text-center">

                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-4xl font-bold text-white shadow-lg">
                    {firstLetter}
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-gray-800">
                    {displayName}
                  </h2>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {user.email ||
                      "No email available"}
                  </p>

                  {user.role && (
                    <span className="mt-4 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold capitalize text-blue-700">
                      {user.role}
                    </span>
                  )}
                </div>

                <div className="mt-8 space-y-5 border-t pt-6">

                  {/* ACCOUNT ID */}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Account ID
                    </p>

                    <p className="mt-1 break-all text-sm text-gray-600">
                      {user._id ||
                        "Not available"}
                    </p>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm text-gray-600">
                      {user.email ||
                        "Not available"}
                    </p>
                  </div>

                  {/* ACCOUNT TYPE */}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Account Type
                    </p>

                    <p className="mt-1 text-sm capitalize text-gray-600">
                      {user.role ||
                        "Student"}
                    </p>
                  </div>

                  {/* BRANCH */}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Branch
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {user.branch ||
                        "Not selected"}
                    </p>
                  </div>

                  {/* SEMESTER */}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Semester
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {user.semester ||
                        "Not selected"}
                    </p>
                  </div>
                </div>
              </section>

              {/* ======================================
                  RIGHT SIDE
              ====================================== */}

              <div className="space-y-6 lg:col-span-2">

                {/* ====================================
                    EDIT PROFILE
                ==================================== */}

                <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">

                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal and
                      academic information.
                    </p>
                  </div>

                  {/* SUCCESS MESSAGE */}

                  {profileMessage && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                      {profileMessage}
                    </div>
                  )}

                  {/* ERROR MESSAGE */}

                  {profileError && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {profileError}
                    </div>
                  )}

                  <form
                    onSubmit={handleProfileUpdate}
                    className="space-y-5"
                  >

                    {/* NAME */}

                    <div>
                      <label
                        htmlFor="profile-name"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Full Name
                      </label>

                      <input
                        id="profile-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                          setName(
                            event.target.value
                          )
                        }
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label
                        htmlFor="profile-email"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Email
                      </label>

                      <input
                        id="profile-email"
                        type="email"
                        value={user.email || ""}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                      />

                      <p className="mt-2 text-xs text-gray-400">
                        Email address cannot be
                        changed here.
                      </p>
                    </div>

                    {/* ==================================
                        BRANCH
                    ================================== */}

                    <div>
                      <label
                        htmlFor="profile-branch"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Branch
                      </label>

                      <select
                        id="profile-branch"
                        value={branch}
                        onChange={(event) =>
                          setBranch(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">
                          Select your branch
                        </option>

                        {BRANCHES.map(
                          (branchName) => (
                            <option
                              key={branchName}
                              value={branchName}
                            >
                              {branchName}
                            </option>
                          )
                        )}
                      </select>

                      <p className="mt-2 text-xs text-gray-400">
                        Select your current
                        engineering branch.
                      </p>
                    </div>

                    {/* ==================================
                        SEMESTER
                    ================================== */}

                    <div>
                      <label
                        htmlFor="profile-semester"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Semester
                      </label>

                      <select
                        id="profile-semester"
                        value={semester}
                        onChange={(event) =>
                          setSemester(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">
                          Select your semester
                        </option>

                        {SEMESTERS.map(
                          (semesterName) => (
                            <option
                              key={semesterName}
                              value={semesterName}
                            >
                              {semesterName}
                            </option>
                          )
                        )}
                      </select>

                      <p className="mt-2 text-xs text-gray-400">
                        Select your current
                        semester.
                      </p>
                    </div>

                    {/* SAVE BUTTON */}

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {savingProfile
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </form>
                </section>

                {/* ====================================
                    CHANGE PASSWORD
                ==================================== */}

                <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">

                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                      Change Password
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Keep your account secure with
                      a strong password.
                    </p>
                  </div>

                  {/* SUCCESS */}

                  {passwordMessage && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                      {passwordMessage}
                    </div>
                  )}

                  {/* ERROR */}

                  {passwordError && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {passwordError}
                    </div>
                  )}

                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-5"
                  >

                    {/* CURRENT PASSWORD */}

                    <div>
                      <label
                        htmlFor="current-password"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Current Password
                      </label>

                      <input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter current password"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>

                    {/* NEW PASSWORD */}

                    <div>
                      <label
                        htmlFor="new-password"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        New Password
                      </label>

                      <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter new password"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />

                      <p className="mt-2 text-xs text-gray-400">
                        Minimum 6 characters.
                      </p>
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Confirm New Password
                      </label>

                      <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        placeholder="Confirm new password"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      />
                    </div>

                    {/* CHANGE PASSWORD BUTTON */}

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {changingPassword
                        ? "Changing Password..."
                        : "Change Password"}
                    </button>
                  </form>
                </section>

              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}