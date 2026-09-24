import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const branches = [
  {
    id: "cse",
    name: "Computer Science Engineering",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
  },
  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
  },
  {
    id: "electronics",
    name: "Electronics Engineering",
  },
  {
    id: "leather",
    name: "Leather Technology",
  },
];

const resourceLinks = [
  {
    name: "Notes",
    path: "/notes",
    description: "Subject-wise study notes",
  },
  {
    name: "PYQ",
    path: "/pyq",
    description: "Previous year questions",
  },
  {
    name: "Syllabus",
    path: "/syllabus",
    description: "Semester-wise syllabus",
  },
  {
    name: "E-Books",
    path: "/ebooks",
    description: "Useful study books",
  },
];

const studyLinks = [
  {
    name: "AI Study Assistant",
    path: "/study-assistant",
    description: "Ask AI your study questions",
  },
  {
    name: "AI Question Paper",
    path: "/ai-question-paper",
    description: "Generate practice papers with AI",
  },
  {
    name: "Study Planner",
    path: "/study-planner",
    description: "Plan your study schedule",
  },
  {
    name: "Online Quiz",
    path: "/quiz",
    description: "Test your technical knowledge",
  },
];

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: "resource" | "announcement" | "system";
  isRead: boolean;
  resource?: {
    _id: string;
    title?: string;
    branch?: string;
    category?: string;
  } | null;
  createdAt: string;
};

export default function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      const loggedIn = Boolean(token);

      setIsLoggedIn(loggedIn);

      if (!userString) {
        setIsAdmin(false);
        return;
      }

      try {
        const user = JSON.parse(userString);

        const role = String(user?.role || "")
          .trim()
          .toLowerCase();

        setIsAdmin(role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load notifications"
        );
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("NOTIFICATION LOAD ERROR:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotifications();

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isLoggedIn]);

  const markNotificationAsRead = async (
    notificationId: string
  ) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark notification as read"
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((previous) =>
        Math.max(previous - 1, 0)
      );
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
    const token = localStorage.getItem("token");

    if (!token || unreadCount === 0) return;

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/read-all`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark notifications as read"
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS READ ERROR:",
        error
      );
    }
  };

  const deleteNotification = async (
    notificationId: string
  ) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete notification"
        );
      }

      const deletedNotification = notifications.find(
        (notification) =>
          notification._id === notificationId
      );

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );

      if (
        deletedNotification &&
        !deletedNotification.isRead
      ) {
        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }
    } catch (error) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        error
      );
    }
  };

  const handleNotificationClick = async (
    notification: Notification
  ) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id);
    }

    setNotificationOpen(false);

    if (notification.resource?._id) {
      navigate("/bookmarks");
    }
  };

  const formatNotificationTime = (
    createdAt: string
  ) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();
    const difference =
      now.getTime() - date.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString();
  };

  const getNotificationIcon = (
    type: Notification["type"]
  ) => {
    if (type === "announcement") {
      return "";
    }

    if (type === "system") {
      return "";
    }

    return "";
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  const toggleMobileSection = (section: string) => {
    setMobileSection((previous) =>
      previous === section ? null : section
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsAdmin(false);
    setNotifications([]);
    setUnreadCount(0);
    setNotificationOpen(false);

    window.dispatchEvent(new Event("auth-change"));

    closeMobileMenu();
    navigate("/login");
  };

  const navClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    [
      "rounded-lg",
      "px-3.5",
      "py-2",
      "text-sm",
      "font-semibold",
      "transition-all",
      "duration-200",
      "whitespace-nowrap",
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    ].join(" ");

  const mobileNavClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    [
      "flex",
      "items-center",
      "justify-between",
      "rounded-xl",
      "px-4",
      "py-3",
      "text-sm",
      "font-semibold",
      "transition-all",
      "duration-200",
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-50",
    ].join(" ");

  const dropdownButtonClass =
    "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900";

  const dropdownItemClass =
    "block rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-gray-50";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center justify-between gap-4">

          {/* BRAND */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              SR
            </div>

            <div className="hidden sm:block">
              <div className="text-[15px] font-extrabold leading-tight tracking-tight text-gray-900">
                Student Resources
              </div>

              <div className="mt-0.5 text-xs font-medium text-gray-500">
                Study smarter. Prepare better.
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex">

            {/* HOME */}
            <NavLink
              to="/"
              end
              className={navClass}
            >
              Home
            </NavLink>

            {/* RESOURCES DROPDOWN */}
            <div className="group relative">
              <button
                type="button"
                className={dropdownButtonClass}
              >
                Resources
                <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50">

                  {resourceLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={dropdownItemClass}
                    >
                      <div className="text-sm font-bold text-gray-800">
                        {item.name}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </div>
                    </NavLink>
                  ))}

                </div>
              </div>
            </div>

            {/* BRANCHES DROPDOWN */}
            <div className="group relative">
              <button
                type="button"
                className={dropdownButtonClass}
              >
                Branches
                <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50">

                  <NavLink
                    to="/branch-resources"
                    className="mb-1 block rounded-xl px-3 py-2.5 text-sm font-bold text-blue-700 transition-all duration-200 hover:bg-blue-50"
                  >
                    All Branch Resources
                  </NavLink>

                  <div className="my-1 border-t border-gray-100" />

                  {branches.map((branch) => (
                    <NavLink
                      key={branch.id}
                      to={`/branch-resources/${branch.id}`}
                      className={dropdownItemClass}
                    >
                      <div className="text-sm font-semibold text-gray-800">
                        {branch.name}
                      </div>
                    </NavLink>
                  ))}

                </div>
              </div>
            </div>

            {/* STUDY & AI DROPDOWN */}
            <div className="group relative">
              <button
                type="button"
                className={dropdownButtonClass}
              >
                Study & AI
                <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50">

                  {studyLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={dropdownItemClass}
                    >
                      <div className="text-sm font-bold text-gray-800">
                        {item.name}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </div>
                    </NavLink>
                  ))}

                </div>
              </div>
            </div>

            {/* DASHBOARD */}
            {isLoggedIn && (
              <NavLink
                to="/dashboard"
                className={navClass}
              >
                Dashboard
              </NavLink>
            )}

            {/* BOOKMARKS */}
            {isLoggedIn && (
              <NavLink
                to="/bookmarks"
                className={navClass}
              >
                Bookmarks
              </NavLink>
            )}

            {/* NOTIFICATIONS */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setNotificationOpen(
                      (previous) => !previous
                    )
                  }
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg text-xl text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Notifications"
                  aria-expanded={notificationOpen}
                >
                  🔔

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white shadow-sm">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60">

                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900">
                          Notifications
                        </h3>

                        {unreadCount > 0 && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {unreadCount} unread
                          </p>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={
                            markAllNotificationsAsRead
                          }
                          className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* NOTIFICATION LIST */}
                    <div className="max-h-[420px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                          <div className="text-3xl">
                            🔔
                          </div>

                          <p className="mt-3 text-sm font-bold text-gray-800">
                            No notifications
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            You are all caught up.
                          </p>
                        </div>
                      ) : (
                        notifications.map(
                          (notification) => (
                            <div
                              key={notification._id}
                              className={[
                                "group relative border-b border-gray-100 px-4 py-3 transition-colors",
                                notification.isRead
                                  ? "bg-white hover:bg-gray-50"
                                  : "bg-blue-50/60 hover:bg-blue-50",
                              ].join(" ")}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleNotificationClick(
                                    notification
                                  )
                                }
                                className="flex w-full gap-3 pr-6 text-left"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                                  {getNotificationIcon(
                                    notification.type
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-bold text-gray-900">
                                      {notification.title}
                                    </p>

                                    {!notification.isRead && (
                                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                    )}
                                  </div>

                                  <p className="mt-1 text-xs leading-5 text-gray-600">
                                    {notification.message}
                                  </p>

                                  <p className="mt-1.5 text-[11px] font-medium text-gray-400">
                                    {formatNotificationTime(
                                      notification.createdAt
                                    )}
                                  </p>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteNotification(
                                    notification._id
                                  )
                                }
                                className="absolute right-3 top-3 hidden rounded-md px-1.5 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-200 hover:text-red-600 group-hover:block"
                                aria-label="Delete notification"
                              >
                                ✕
                              </button>
                            </div>
                          )
                        )
                      )}
                    </div>

                    {/* FOOTER */}
                    {notifications.length > 0 && (
                      <div className="border-t border-gray-100 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setNotificationOpen(false);
                            navigate("/dashboard");
                          }}
                          className="w-full rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* DESKTOP ACCOUNT ACTIONS */}
          <div className="hidden items-center gap-2 md:flex">

            {/* PROFILE */}
            {isLoggedIn && (
              <NavLink
                to="/profile"
                className={navClass}
              >
                Profile
              </NavLink>
            )}

            {/* ADMIN */}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  [
                    "rounded-lg",
                    "border",
                    "px-3.5",
                    "py-2",
                    "text-sm",
                    "font-bold",
                    "transition-all",
                    "duration-200",
                    "whitespace-nowrap",
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                  ].join(" ")
                }
              >
                Admin
              </NavLink>
            )}

            {/* LOGGED IN */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow active:scale-[0.98]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((previous) => !previous)
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-lg text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 md:hidden"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">

            <nav className="flex flex-col gap-1">

              {/* HOME */}
              <NavLink
                to="/"
                end
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>Home</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              {/* RESOURCES */}
              <div className="rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    toggleMobileSection("resources")
                  }
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                >
                  <span>Resources</span>

                  <span
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      mobileSection === "resources"
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {mobileSection === "resources" && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                    {resourceLinks.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* BRANCHES */}
              <div className="rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    toggleMobileSection("branches")
                  }
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                >
                  <span>Branches</span>

                  <span
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      mobileSection === "branches"
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {mobileSection === "branches" && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">

                    <NavLink
                      to="/branch-resources"
                      onClick={closeMobileMenu}
                      className="block rounded-lg px-3 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
                    >
                      All Branch Resources
                    </NavLink>

                    {branches.map((branch) => (
                      <NavLink
                        key={branch.id}
                        to={`/branch-resources/${branch.id}`}
                        onClick={closeMobileMenu}
                        className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {branch.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* STUDY & AI */}
              <div className="rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    toggleMobileSection("study")
                  }
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                >
                  <span>Study & AI</span>

                  <span
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      mobileSection === "study"
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {mobileSection === "study" && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">

                    {studyLinks.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* DASHBOARD */}
              {isLoggedIn && (
                <NavLink
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Dashboard</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}

              {/* BOOKMARKS */}
              {isLoggedIn && (
                <NavLink
                  to="/bookmarks"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Bookmarks</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}

              {/* MOBILE NOTIFICATIONS */}
              {isLoggedIn && (
                <div className="rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileSection(
                        "notifications"
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <span>🔔</span>
                      <span>Notifications</span>

                      {unreadCount > 0 && (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                          {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                        </span>
                      )}
                    </span>

                    <span
                      className={`text-xs text-gray-400 transition-transform duration-200 ${
                        mobileSection ===
                        "notifications"
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {mobileSection ===
                    "notifications" && (
                    <div className="ml-3 mt-1 border-l-2 border-gray-100 pl-2">

                      <div className="mb-2 flex items-center justify-between px-3">
                        <span className="text-xs font-bold text-gray-500">
                          Recent notifications
                        </span>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={
                              markAllNotificationsAsRead
                            }
                            className="text-[11px] font-bold text-blue-600"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <div className="rounded-lg px-3 py-4 text-center text-xs text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(
                          (notification) => (
                            <div
                              key={notification._id}
                              className={[
                                "relative mb-1 rounded-lg",
                                notification.isRead
                                  ? "bg-white"
                                  : "bg-blue-50",
                              ].join(" ")}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleNotificationClick(
                                    notification
                                  )
                                }
                                className="w-full px-3 py-2.5 pr-8 text-left"
                              >
                                <div className="flex gap-2">
                                  <span className="text-base">
                                    {getNotificationIcon(
                                      notification.type
                                    )}
                                  </span>

                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-gray-800">
                                      {notification.title}
                                    </div>

                                    <div className="mt-0.5 text-[11px] leading-4 text-gray-600">
                                      {notification.message}
                                    </div>

                                    <div className="mt-1 text-[10px] text-gray-400">
                                      {formatNotificationTime(
                                        notification.createdAt
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteNotification(
                                    notification._id
                                  )
                                }
                                className="absolute right-2 top-2 rounded px-1 text-xs text-gray-400 hover:bg-gray-200 hover:text-red-600"
                                aria-label="Delete notification"
                              >
                                ✕
                              </button>
                            </div>
                          )
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE */}
              {isLoggedIn && (
                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Profile</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}

              {/* ADMIN */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Admin Dashboard</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}
            </nav>

            {/* MOBILE ACCOUNT ACTIONS */}
            <div className="mt-4 border-t border-gray-100 pt-4">

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition-all duration-200 hover:bg-blue-700"
                  >
                    Register
                  </Link>

                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}