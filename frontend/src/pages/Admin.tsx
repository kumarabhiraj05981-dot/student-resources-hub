import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  branch?: string;
  category: string;
  semester: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

interface AnalyticsOverview {
  totalUsers: number;
  totalAdmins: number;
  totalResources: number;
  totalBookmarks: number;
  totalNotifications: number;
  unreadNotifications: number;
}

interface AnalyticsItem {
  _id: string;
  count: number;
}

interface RecentResource {
  _id: string;
  title: string;
  branch?: string;
  semester?: string;
  category?: string;
  subject?: string;
  createdAt: string;
}

interface MostBookmarkedResource {
  _id: string;
  title: string;
  branch?: string;
  semester?: string;
  category?: string;
  bookmarks: number;
}

interface AnalyticsData {
  overview: AnalyticsOverview;
  resourcesByBranch: AnalyticsItem[];
  resourcesByCategory: AnalyticsItem[];
  resourcesBySemester: AnalyticsItem[];
  recentResources: RecentResource[];
  mostBookmarked: MostBookmarkedResource[];
}

const BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

const CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];

const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
];

const MAX_FILE_SIZE = 500 * 1024 * 1024;

export default function Admin() {
  // ==========================================
  // UPLOAD STATES
  // ==========================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("Computer Science");
  const [semester, setSemester] = useState("");
  const [category, setCategory] = useState("Notes");
  const [subject, setSubject] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploading, setUploading] = useState(false);

  // ==========================================
  // RESOURCE STATES
  // ==========================================

  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] =
    useState(true);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] =
    useState("All");
  const [filterBranch, setFilterBranch] =
    useState("All");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // ==========================================
  // EDIT STATES
  // ==========================================

  const [editingResource, setEditingResource] =
    useState<Resource | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editBranch, setEditBranch] =
    useState("Computer Science");
  const [editSemester, setEditSemester] =
    useState("");
  const [editCategory, setEditCategory] =
    useState("Notes");
  const [editSubject, setEditSubject] =
    useState("");

  const [savingEdit, setSavingEdit] =
    useState(false);

  // ==========================================
  // ANALYTICS STATES
  // ==========================================

  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  const [loadingAnalytics, setLoadingAnalytics] =
    useState(true);

  // ==========================================
  // LOAD RESOURCES
  // ==========================================

  const loadResources = async () => {
    try {
      setLoadingResources(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await api.get(
        "/api/resources",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("RESOURCES:", res.data);

      setResources(
        Array.isArray(res.data?.resources)
          ? res.data.resources
          : []
      );
    } catch (error: any) {
      console.error(
        "LOAD RESOURCES ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load resources"
      );
    } finally {
      setLoadingResources(false);
    }
  };

  // ==========================================
  // LOAD ADMIN ANALYTICS
  // ==========================================

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);

      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const res = await api.get(
        "/api/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ANALYTICS:",
        res.data
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Failed to load analytics"
        );
      }

      setAnalytics(res.data);
    } catch (error: any) {
      console.error(
        "LOAD ANALYTICS ERROR:",
        error.response?.data || error
      );

      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadResources();
    loadAnalytics();
  }, []);

  // ==========================================
  // RESET FILE INPUT
  // ==========================================

  const resetFileInput = () => {
    setFile(null);
    setFileInputKey((prev) => prev + 1);
  };

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    console.log("FILE INPUT CHANGED");

    const inputFile =
      e.currentTarget.files?.[0];

    console.log(
      "SELECTED FILE:",
      inputFile
    );

    if (!inputFile) {
      setFile(null);
      return;
    }

    const isPDF =
      inputFile.type === "application/pdf" ||
      inputFile.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
      alert("Only PDF files are allowed");

      e.currentTarget.value = "";
      setFile(null);

      return;
    }

    if (inputFile.size > MAX_FILE_SIZE) {
      alert(
        "File size must be less than 500MB"
      );

      e.currentTarget.value = "";
      setFile(null);

      return;
    }

    setFile(inputFile);

    console.log(
      "FILE SAVED:",
      inputFile.name
    );
  };

  // ==========================================
  // UPLOAD RESOURCE
  // ==========================================

  const handleUpload = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter resource title");
      return;
    }

    if (!branch) {
      alert("Please select branch");
      return;
    }

    if (!semester) {
      alert("Please select semester");
      return;
    }

    if (!category) {
      alert("Please select category");
      return;
    }

    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
      alert("Only PDF files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(
        "File size must be less than 500MB"
      );
      return;
    }

    try {
      setUploading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "branch",
        branch
      );

      formData.append(
        "semester",
        semester
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "subject",
        subject.trim()
      );

      formData.append(
        "file",
        file,
        file.name
      );

      console.log(
        "================================"
      );
      console.log(
        "UPLOADING FILE"
      );
      console.log(
        "Name:",
        file.name
      );
      console.log(
        "Type:",
        file.type
      );
      console.log(
        "Size:",
        file.size
      );
      console.log(
        "Branch:",
        branch
      );
      console.log(
        "Semester:",
        semester
      );
      console.log(
        "Category:",
        category
      );
      console.log(
        "================================"
      );

      const res = await api.post(
        "/api/upload",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          maxContentLength:
            500 * 1024 * 1024,

          maxBodyLength:
            500 * 1024 * 1024,
        }
      );

      console.log(
        "UPLOAD RESPONSE:",
        res.data
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Upload failed"
        );
      }

      alert(
        `Resource uploaded successfully!\n\nBranch: ${branch}`
      );

      setTitle("");
      setDescription("");
      setBranch("Computer Science");
      setSemester("");
      setCategory("Notes");
      setSubject("");

      resetFileInput();

      await Promise.all([
        loadResources(),
        loadAnalytics(),
      ]);
    } catch (error: any) {
      console.error(
        "UPLOAD ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "File upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (
    resource: Resource
  ) => {
    setEditingResource(resource);

    setEditTitle(
      resource.title || ""
    );

    setEditDescription(
      resource.description || ""
    );

    setEditBranch(
      resource.branch ||
        "Computer Science"
    );

    setEditSemester(
      resource.semester || ""
    );

    setEditCategory(
      resource.category || "Notes"
    );

    setEditSubject(
      resource.subject || ""
    );
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const closeEditModal = () => {
    if (savingEdit) return;

    setEditingResource(null);

    setEditTitle("");
    setEditDescription("");
    setEditBranch(
      "Computer Science"
    );
    setEditSemester("");
    setEditCategory("Notes");
    setEditSubject("");
  };

  // ==========================================
  // SAVE EDIT
  // ==========================================

  const handleSaveEdit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!editingResource) return;

    if (!editTitle.trim()) {
      alert("Please enter resource title");
      return;
    }

    if (!editBranch) {
      alert("Please select branch");
      return;
    }

    if (!editSemester) {
      alert("Please select semester");
      return;
    }

    if (!editCategory) {
      alert("Please select category");
      return;
    }

    try {
      setSavingEdit(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await api.put(
        `/api/resources/${editingResource._id}`,
        {
          title: editTitle.trim(),

          description:
            editDescription.trim(),

          branch: editBranch,

          semester: editSemester,

          category: editCategory,

          subject:
            editSubject.trim(),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "EDIT RESPONSE:",
        res.data
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Update failed"
        );
      }

      if (res.data?.resource) {
        setResources((prev) =>
          prev.map((item) =>
            item._id ===
            editingResource._id
              ? res.data.resource
              : item
          )
        );
      } else {
        await loadResources();
      }

      await loadAnalytics();

      alert(
        "Resource updated successfully!"
      );

      closeEditModal();
    } catch (error: any) {
      console.error(
        "EDIT RESOURCE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update resource"
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ==========================================
  // DELETE RESOURCE
  // ==========================================

  const handleDelete = async (
    id: string
  ) => {
    const resource = resources.find(
      (item) => item._id === id
    );

    if (!resource) return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${resource.title}"?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await api.delete(
        `/api/resources/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "DELETE RESPONSE:",
        res.data
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Delete failed"
        );
      }

      alert(
        "Resource deleted successfully!"
      );

      setResources((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      await loadAnalytics();
    } catch (error: any) {
      console.error(
        "DELETE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete resource"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // FILTER RESOURCES
  // ==========================================

  const filteredResources =
    resources.filter((resource) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        resource.title
          ?.toLowerCase()
          .includes(searchText) ||
        resource.subject
          ?.toLowerCase()
          .includes(searchText) ||
        resource.description
          ?.toLowerCase()
          .includes(searchText) ||
        resource.branch
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        filterCategory === "All" ||
        resource.category
          ?.toLowerCase() ===
          filterCategory.toLowerCase();

      const matchesBranch =
        filterBranch === "All" ||
        resource.branch ===
          filterBranch;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBranch
      );
    });

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(2)} KB`;
    }

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(2)} MB`;
  };

  // ==========================================
  // BRANCH ICON
  // ==========================================

  const getBranchIcon = (
    branchName?: string
  ) => {
    switch (branchName) {
      case "Computer Science":
        return "💻";

      case "Electrical":
        return "⚡";

      case "Mechanical":
        return "⚙️";

      case "Civil & CTM":
        return "🏗️";

      case "Electronics":
        return "🔌";

      case "Leather Technology":
        return "👜";

      default:
        return "📚";
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            ADMIN ANALYTICS
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                📊 Admin Analytics
              </h2>

              <p className="text-gray-500 mt-1">
                Overview of students,
                resources and activity.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAnalytics}
              disabled={loadingAnalytics}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2.5 rounded-lg transition"
            >
              {loadingAnalytics
                ? "Loading..."
                : "Refresh Analytics"}
            </button>

          </div>

          {loadingAnalytics ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Loading analytics...
              </p>
            </div>
          ) : analytics ? (
            <>
              {/* ==================================
                  OVERVIEW CARDS
              ================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-600">
                    👨‍🎓 Total Students
                  </p>

                  <p className="text-3xl font-bold text-blue-800 mt-2">
                    {analytics.overview.totalUsers}
                  </p>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <p className="text-sm font-semibold text-green-600">
                    📚 Total Resources
                  </p>

                  <p className="text-3xl font-bold text-green-800 mt-2">
                    {analytics.overview.totalResources}
                  </p>
                </div>

                <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
                  <p className="text-sm font-semibold text-purple-600">
                    🔖 Total Bookmarks
                  </p>

                  <p className="text-3xl font-bold text-purple-800 mt-2">
                    {analytics.overview.totalBookmarks}
                  </p>
                </div>

                <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                  <p className="text-sm font-semibold text-orange-600">
                    🔔 Notifications
                  </p>

                  <p className="text-3xl font-bold text-orange-800 mt-2">
                    {analytics.overview.totalNotifications}
                  </p>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <p className="text-sm font-semibold text-red-600">
                    🔴 Unread Notifications
                  </p>

                  <p className="text-3xl font-bold text-red-800 mt-2">
                    {analytics.overview.unreadNotifications}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm font-semibold text-gray-600">
                    🛡️ Total Admins
                  </p>

                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {analytics.overview.totalAdmins}
                  </p>
                </div>

              </div>

              {/* ==================================
                  BRANCH + CATEGORY
              ================================== */}

              <div className="grid lg:grid-cols-2 gap-6 mt-8">

                {/* BY BRANCH */}

                <div className="border border-gray-200 rounded-xl p-5">

                  <h3 className="text-xl font-bold text-gray-800 mb-5">
                    📚 Resources by Branch
                  </h3>

                  <div className="space-y-3">

                    {analytics.resourcesByBranch.length === 0 ? (
                      <p className="text-gray-500">
                        No branch data available.
                      </p>
                    ) : (
                      analytics.resourcesByBranch.map(
                        (item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-gray-700 font-medium">
                              {getBranchIcon(
                                item._id
                              )}{" "}
                              {item._id ||
                                "Unknown"}
                            </span>

                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                              {item.count}
                            </span>
                          </div>
                        )
                      )
                    )}

                  </div>

                </div>

                {/* BY CATEGORY */}

                <div className="border border-gray-200 rounded-xl p-5">

                  <h3 className="text-xl font-bold text-gray-800 mb-5">
                    🗂️ Resources by Category
                  </h3>

                  <div className="space-y-3">

                    {analytics.resourcesByCategory.length === 0 ? (
                      <p className="text-gray-500">
                        No category data available.
                      </p>
                    ) : (
                      analytics.resourcesByCategory.map(
                        (item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-gray-700 font-medium">
                              {item._id ||
                                "Unknown"}
                            </span>

                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                              {item.count}
                            </span>
                          </div>
                        )
                      )
                    )}

                  </div>

                </div>

              </div>

              {/* ==================================
                  BY SEMESTER
              ================================== */}

              <div className="border border-gray-200 rounded-xl p-5 mt-6">

                <h3 className="text-xl font-bold text-gray-800 mb-5">
                  🎓 Resources by Semester
                </h3>

                {analytics.resourcesBySemester.length === 0 ? (
                  <p className="text-gray-500">
                    No semester data available.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

                    {analytics.resourcesBySemester.map(
                      (item) => (
                        <div
                          key={item._id}
                          className="rounded-xl bg-purple-50 border border-purple-200 p-4 text-center"
                        >
                          <p className="text-sm font-semibold text-purple-700">
                            {item._id ||
                              "Unknown"}
                          </p>

                          <p className="text-2xl font-bold text-purple-900 mt-2">
                            {item.count}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* ==================================
                  MOST BOOKMARKED
              ================================== */}

              <div className="border border-gray-200 rounded-xl p-5 mt-6">

                <h3 className="text-xl font-bold text-gray-800 mb-5">
                  ⭐ Most Bookmarked Resources
                </h3>

                {analytics.mostBookmarked.length === 0 ? (
                  <p className="text-gray-500">
                    No bookmarks available yet.
                  </p>
                ) : (
                  <div className="space-y-3">

                    {analytics.mostBookmarked.map(
                      (resource, index) => (
                        <div
                          key={resource._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-gray-50 border border-gray-200 p-4"
                        >

                          <div className="min-w-0">

                            <p className="font-bold text-gray-800 break-words">
                              {index + 1}.{" "}
                              {resource.title}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-2">

                              {resource.branch && (
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                  {resource.branch}
                                </span>
                              )}

                              {resource.category && (
                                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  {resource.category}
                                </span>
                              )}

                              {resource.semester && (
                                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                  {resource.semester}
                                </span>
                              )}

                            </div>

                          </div>

                          <span className="self-start sm:self-auto px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold whitespace-nowrap">
                            🔖{" "}
                            {resource.bookmarks}
                          </span>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* ==================================
                  RECENT RESOURCES
              ================================== */}

              <div className="border border-gray-200 rounded-xl p-5 mt-6">

                <h3 className="text-xl font-bold text-gray-800 mb-5">
                  🆕 Recent Resources
                </h3>

                {analytics.recentResources.length === 0 ? (
                  <p className="text-gray-500">
                    No resources available.
                  </p>
                ) : (
                  <div className="space-y-3">

                    {analytics.recentResources.map(
                      (resource) => (
                        <div
                          key={resource._id}
                          className="rounded-xl bg-gray-50 border border-gray-200 p-4"
                        >

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <div className="min-w-0">

                              <p className="font-bold text-gray-800 break-words">
                                {resource.title}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-2">

                                {resource.branch && (
                                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    {resource.branch}
                                  </span>
                                )}

                                {resource.category && (
                                  <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    {resource.category}
                                  </span>
                                )}

                                {resource.semester && (
                                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    {resource.semester}
                                  </span>
                                )}

                                {resource.subject && (
                                  <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                    {resource.subject}
                                  </span>
                                )}

                              </div>

                            </div>

                            <p className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(
                                resource.createdAt
                              ).toLocaleDateString()}
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Analytics unavailable.
              </p>

              <button
                type="button"
                onClick={loadAnalytics}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

        </div>

        {/* ======================================
            UPLOAD SECTION
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">

          <div className="mb-8">

            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
              Admin Resource Upload
            </h1>

            <p className="text-gray-600">
              Upload Notes, PYQs, Syllabus and
              E-books branch-wise.
            </p>

          </div>

          <form
            onSubmit={handleUpload}
            className="space-y-6"
          >

            {/* TITLE */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Resource Title *
              </label>

              <input
                type="text"
                placeholder="Example: DBMS Unit 1 Notes"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

            </div>

            {/* BRANCH */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Branch *
              </label>

              <select
                value={branch}
                onChange={(e) =>
                  setBranch(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >

                {BRANCHES.map(
                  (branchName) => (
                    <option
                      key={branchName}
                      value={branchName}
                    >
                      {getBranchIcon(
                        branchName
                      )}{" "}
                      {branchName}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                placeholder="Enter resource description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />

            </div>

            {/* SEMESTER */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Semester *
              </label>

              <select
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >

                <option value="">
                  Select Semester
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

            </div>

            {/* SUBJECT */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Subject
              </label>

              <input
                type="text"
                placeholder="Example: DBMS"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Category *
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >

                {CATEGORIES.map(
                  (categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName ===
                      "Ebooks"
                        ? "E-Books"
                        : categoryName}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* PDF FILE */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Select PDF *
              </label>

              <input
                key={fileInputKey}
                id="resource-file"
                name="file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white cursor-pointer"
                required={!file}
              />

              {file ? (
                <div className="mt-3 bg-green-50 border border-green-300 rounded-xl p-4">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div className="min-w-0">

                      <p className="text-xs text-green-700 font-semibold mb-1">
                        SELECTED FILE
                      </p>

                      <p className="text-sm text-green-800 font-bold break-all">
                        {file.name}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <p className="text-sm text-gray-600 whitespace-nowrap">
                        {formatFileSize(
                          file.size
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={
                          resetFileInput
                        }
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>
              ) : (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    No file selected
                  </p>

                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Maximum file size:{" "}
                <strong>500MB</strong>.
                PDF files only.
              </p>

            </div>

            {/* UPLOAD BUTTON */}

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3.5 rounded-lg text-white font-bold text-lg transition ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {uploading
                ? "Uploading to Cloudinary..."
                : "Upload Resource"}
            </button>

          </form>

        </div>

        {/* ======================================
            RESOURCE MANAGEMENT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Manage Resources
              </h2>

              <p className="text-gray-500 mt-1">
                Total resources:{" "}
                <span className="font-bold text-blue-600">
                  {resources.length}
                </span>
              </p>

            </div>

            <button
              type="button"
              onClick={async () => {
                await loadResources();
                await loadAnalytics();
              }}
              disabled={
                loadingResources ||
                loadingAnalytics
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2.5 rounded-lg transition"
            >
              {loadingResources ||
              loadingAnalytics
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

          {/* FILTERS */}

          <div className="mb-6">

            <h3 className="text-xl font-bold text-gray-800">
              Filter Resources
            </h3>

            <p className="text-gray-500 mt-1">
              Search and filter your uploaded
              resources.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">

            {/* SEARCH */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>

              <input
                type="text"
                placeholder="Search title, subject, branch..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="All">
                  All Categories
                </option>

                {CATEGORIES.map(
                  (categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName ===
                      "Ebooks"
                        ? "E-Books"
                        : categoryName}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* BRANCH */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Branch
              </label>

              <select
                value={filterBranch}
                onChange={(e) =>
                  setFilterBranch(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="All">
                  All Branches
                </option>

                {BRANCHES.map(
                  (branchName) => (
                    <option
                      key={branchName}
                      value={branchName}
                    >
                      {getBranchIcon(
                        branchName
                      )}{" "}
                      {branchName}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* RESOURCE LIST */}

          {loadingResources ? (
            <div className="text-center py-10">

              <p className="text-gray-500">
                Loading resources...
              </p>

            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-10">

              <p className="text-gray-500">
                No resources found.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {filteredResources.map(
                (resource) => (
                  <div
                    key={resource._id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div className="min-w-0">

                        <h3 className="text-lg font-bold text-gray-800 break-words">
                          {resource.title}
                        </h3>

                        {resource.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {resource.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">

                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {resource.branch}
                          </span>

                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {resource.category}
                          </span>

                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {resource.semester}
                          </span>

                          {resource.subject && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              {resource.subject}
                            </span>
                          )}

                        </div>

                        {resource.fileName && (
                          <p className="text-xs text-gray-500 mt-3 break-all">
                            File:{" "}
                            {resource.fileName}
                          </p>
                        )}

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="flex flex-wrap gap-2">

                        {resource.fileUrl && (
                          <a
                            href={
                              resource.fileUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
                          >
                            Open
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              resource
                            )
                          }
                          disabled={
                            deletingId ===
                            resource._id
                          }
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              resource._id
                            )
                          }
                          disabled={
                            deletingId ===
                            resource._id
                          }
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm"
                        >
                          {deletingId ===
                          resource._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* ==========================================
          EDIT MODAL
      ========================================== */}

      {editingResource && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (
              e.target ===
                e.currentTarget &&
              !savingEdit
            ) {
              closeEditModal();
            }
          }}
        >

          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-200">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Resource
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update resource information.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={savingEdit}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-700 text-xl font-bold transition"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* EDIT FORM */}

            <form
              onSubmit={
                handleSaveEdit
              }
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Resource Title *
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(
                      e.target.value
                    )
                  }
                  placeholder="Enter resource title"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />

              </div>

              {/* BRANCH */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Branch *
                </label>

                <select
                  value={editBranch}
                  onChange={(e) =>
                    setEditBranch(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >

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

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  value={
                    editDescription
                  }
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter resource description"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              {/* SEMESTER */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Semester *
                </label>

                <select
                  value={
                    editSemester
                  }
                  onChange={(e) =>
                    setEditSemester(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >

                  <option value="">
                    Select Semester
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

              </div>

              {/* SUBJECT */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) =>
                    setEditSubject(
                      e.target.value
                    )
                  }
                  placeholder="Example: DBMS"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="block font-semibold text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  value={
                    editCategory
                  }
                  onChange={(e) =>
                    setEditCategory(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >

                  {CATEGORIES.map(
                    (categoryName) => (
                      <option
                        key={categoryName}
                        value={categoryName}
                      >
                        {categoryName ===
                        "Ebooks"
                          ? "E-Books"
                          : categoryName}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* EXISTING FILE */}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Existing PDF
                </p>

                <p className="text-sm text-blue-700 break-all">
                  {editingResource.fileName ||
                    "Current Cloudinary PDF"}
                </p>

                <p className="text-xs text-blue-600 mt-2">
                  The existing PDF will remain
                  unchanged.
                </p>

              </div>

              {/* MODAL ACTIONS */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  disabled={savingEdit}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className={`px-5 py-3 rounded-lg text-white font-semibold transition ${
                    savingEdit
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {savingEdit
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}