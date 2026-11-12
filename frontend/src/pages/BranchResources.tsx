
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BookmarkButton from "../components/bookmarks/BookmarkButton";
import ResourceFilters from "../components/resources/ResourceFilters";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  branch?: string;
  category?: string;
  semester?: string;
  subject?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt?: string;
}

interface Branch {
  id: string;
  name: string;
  shortName: string;
  description: string;
}

const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    description:
      "Notes, PYQs, Syllabus, E-Books and other study resources.",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical",
    description:
      "Electrical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    description:
      "Mechanical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
    shortName: "Civil / CTM",
    description:
      "Civil Engineering and CTM study resources.",
  },
  {
    id: "electronics",
    name: "Electronics Engineering",
    shortName: "Electronics",
    description:
      "Electronics Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather",
    description:
      "Leather Technology notes, PYQs, syllabus and study materials.",
  },
];

const branchApiNames: Record<string, string> = {
  cse: "Computer Science",
  electrical: "Electrical",
  mechanical: "Mechanical",
  "civil-ctm": "Civil & CTM",
  electronics: "Electronics",
  leather: "Leather Technology",
};

const branchFilterOptions = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Leather Technology",
];

const resourceFolders = [
  {
    id: "Notes",
    name: "Notes",
    description: "Study notes, unit notes and subject-wise learning material.",
    icon: "📘",
    iconBg: "bg-blue-100",
    iconText: "text-blue-700",
    cardBg: "bg-blue-50",
    cardHover: "hover:bg-blue-100",
    border: "border-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
    accent: "text-blue-700",
    countBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "PYQ",
    name: "PYQ",
    description: "Previous year question papers and exam papers.",
    icon: "📝",
    iconBg: "bg-orange-100",
    iconText: "text-orange-700",
    cardBg: "bg-orange-50",
    cardHover: "hover:bg-orange-100",
    border: "border-orange-200",
    button: "bg-orange-500 hover:bg-orange-600",
    accent: "text-orange-700",
    countBg: "bg-orange-100 text-orange-700",
  },
  {
    id: "Syllabus",
    name: "Syllabus",
    description: "Semester-wise syllabus and course documents.",
    icon: "📋",
    iconBg: "bg-purple-100",
    iconText: "text-purple-700",
    cardBg: "bg-purple-50",
    cardHover: "hover:bg-purple-100",
    border: "border-purple-200",
    button: "bg-purple-600 hover:bg-purple-700",
    accent: "text-purple-700",
    countBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "Ebooks",
    name: "E-Books",
    description: "Useful books and learning material in PDF format.",
    icon: "📚",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
    cardBg: "bg-emerald-50",
    cardHover: "hover:bg-emerald-100",
    border: "border-emerald-200",
    button: "bg-emerald-600 hover:bg-emerald-700",
    accent: "text-emerald-700",
    countBg: "bg-emerald-100 text-emerald-700",
  },
];

const semesterAliases: Record<string, string[]> = {
  "1": ["1", "1st", "1st semester", "semester 1", "semester-1"],
  "2": ["2", "2nd", "2nd semester", "semester 2", "semester-2"],
  "3": ["3", "3rd", "3rd semester", "semester 3", "semester-3"],
  "4": ["4", "4th", "4th semester", "semester 4", "semester-4"],
  "5": ["5", "5th", "5th semester", "semester 5", "semester-5"],
  "6": ["6", "6th", "6th semester", "semester 6", "semester-6"],
  "7": ["7", "7th", "7th semester", "semester 7", "semester-7"],
  "8": ["8", "8th", "8th semester", "semester 8", "semester-8"],
};

const normalize = (value?: string) => {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
};

// ==========================================
// GET CORRECT RESOURCE TITLE
// ==========================================

const getResourceTitle = (resource: Resource): string => {
  const title = resource.title?.trim();

  if (title && title.toLowerCase() !== "unknown") {
    return title;
  }

  const fileName = resource.fileName?.trim();

  if (fileName) {
    return fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();
  }

  return (
    resource.subject?.trim() ||
    resource.category ||
    "Study Material"
  );
};

// ==========================================
// BRANCH MATCHING
// ==========================================

const matchesBranch = (
  resourceBranch: string,
  selectedBranch: string
) => {
  const resource = normalize(resourceBranch);
  const selected = normalize(selectedBranch);

  if (!resource || !selected) return false;

  if (selected === "computer science") {
    return [
      "computer science",
      "computer science engineering",
      "cse",
    ].includes(resource);
  }

  if (selected === "information technology") {
    return [
      "information technology",
      "information technology engineering",
      "it",
    ].includes(resource);
  }

  if (selected === "electronics & communication") {
    return [
      "electronics",
      "electronics engineering",
      "electronics & communication",
      "electronics and communication",
      "electronics and communication engineering",
      "ece",
    ].includes(resource);
  }

  if (selected === "electrical") {
    return ["electrical", "electrical engineering", "eee"].includes(
      resource
    );
  }

  if (selected === "mechanical") {
    return ["mechanical", "mechanical engineering", "me"].includes(
      resource
    );
  }

  if (selected === "civil & ctm") {
    return [
      "civil & ctm",
      "civil / ctm",
      "civil",
      "civil engineering",
      "civil engineering / ctm",
      "civil and ctm",
    ].includes(resource);
  }

  if (selected === "leather technology") {
    return ["leather technology", "leather"].includes(resource);
  }

  return resource === selected;
};

// ==========================================
// SEMESTER MATCHING
// ==========================================

const matchesSemester = (
  resourceSemester: string,
  selectedSemester: string
) => {
  if (!selectedSemester) return true;

  const resourceValue = normalize(resourceSemester);

  const aliases = semesterAliases[selectedSemester] || [
    normalize(selectedSemester),
  ];

  return aliases.includes(resourceValue);
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function BranchResources() {
  const { branchId } = useParams();

  const currentBranch =
    branches.find((item) => item.id === branchId) || branches[0];

  const apiBranchName =
    branchApiNames[currentBranch.id] || "Computer Science";

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [selectedFolder, setSelectedFolder] = useState<string | null>(
    null
  );

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // ==========================================
  // LOAD RESOURCES
  // ==========================================

  const loadResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/resources");
      const data = response.data;

      if (Array.isArray(data)) {
        setResources(data);
      } else if (Array.isArray(data?.resources)) {
        setResources(data.resources);
      } else {
        setResources([]);
      }
    } catch (err: any) {
      console.error("RESOURCE LOAD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Resources load nahi ho pa rahe hain."
      );

      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD BOOKMARKS
  // ==========================================

  const loadBookmarks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setBookmarkedIds([]);
      return;
    }

    try {
      const response = await api.get("/api/bookmarks/ids", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookmarkedIds(
        Array.isArray(response.data?.resourceIds)
          ? response.data.resourceIds
          : []
      );
    } catch (err) {
      console.error("BOOKMARK LOAD ERROR:", err);
      setBookmarkedIds([]);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadResources();
    loadBookmarks();
  }, []);

  // ==========================================
  // RESET WHEN BRANCH CHANGES
  // ==========================================

  useEffect(() => {
    setSelectedFolder(null);
    setSearch("");
    setBranchFilter("");
    setSemesterFilter("");
    setCategoryFilter("");
  }, [currentBranch.id]);

  // ==========================================
  // BOOKMARK CHANGE
  // ==========================================

  const handleBookmarkChange = (
    resourceId: string,
    bookmarked: boolean
  ) => {
    setBookmarkedIds((previous) => {
      if (bookmarked) {
        if (previous.includes(resourceId)) return previous;
        return [...previous, resourceId];
      }

      return previous.filter((id) => id !== resourceId);
    });
  };

  // ==========================================
  // CURRENT BRANCH RESOURCES
  // ==========================================

  const branchResources = useMemo(() => {
    return resources.filter((resource) =>
      matchesBranch(resource.branch || "", apiBranchName)
    );
  }, [resources, apiBranchName]);

  // ==========================================
  // FILTERED RESOURCES
  // ==========================================

  const filteredResources = useMemo(() => {
    const searchValue = normalize(search);

    return branchResources.filter((resource) => {
      const resourceTitle = getResourceTitle(resource);

      const matchesSearch =
        !searchValue ||
        normalize(resourceTitle).includes(searchValue) ||
        normalize(resource.description).includes(searchValue) ||
        normalize(resource.subject).includes(searchValue) ||
        normalize(resource.branch).includes(searchValue) ||
        normalize(resource.semester).includes(searchValue) ||
        normalize(resource.category).includes(searchValue) ||
        normalize(resource.fileName).includes(searchValue);

      const matchesSelectedBranch =
        !branchFilter ||
        matchesBranch(resource.branch || "", branchFilter);

      const matchesSelectedSemester = matchesSemester(
        resource.semester || "",
        semesterFilter
      );

      const matchesSelectedCategory =
        !categoryFilter ||
        normalize(resource.category) === normalize(categoryFilter);

      return (
        matchesSearch &&
        matchesSelectedBranch &&
        matchesSelectedSemester &&
        matchesSelectedCategory
      );
    });
  }, [
    branchResources,
    search,
    branchFilter,
    semesterFilter,
    categoryFilter,
  ]);

  // ==========================================
  // FOLDER RESOURCES
  // ==========================================

  const currentFolderResources = useMemo(() => {
    if (!selectedFolder) return [];

    return filteredResources.filter(
      (resource) =>
        normalize(resource.category) === normalize(selectedFolder)
    );
  }, [filteredResources, selectedFolder]);

  // ==========================================
  // FOLDER COUNT
  // ==========================================

  const getFolderCount = (folderId: string) => {
    return branchResources.filter(
      (resource) =>
        normalize(resource.category) === normalize(folderId)
    ).length;
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setBranchFilter("");
    setSemesterFilter("");
    setCategoryFilter("");
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date?: string) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ==========================================
  // OPEN PDF
  // ==========================================

  const openPdf = (url?: string) => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const selectedFolderInfo = resourceFolders.find(
    (folder) => folder.id === selectedFolder
  );

  const filtersActive =
    search.trim() !== "" ||
    branchFilter !== "" ||
    semesterFilter !== "" ||
    categoryFilter !== "";

  // ==========================================
  // JSX
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 text-white">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-50">
                STUDENT RESOURCES HUB
              </span>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {currentBranch.name}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                {currentBranch.description}
              </p>

              {!loading && (
                <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
                  <span className="text-2xl">📚</span>

                  <div className="text-left">
                    <p className="text-xs text-blue-100">
                      Available Resources
                    </p>

                    <p className="text-2xl font-extrabold">
                      {branchResources.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BRANCH SELECTOR */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Explore Departments
              </span>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                Select Your Branch
              </h2>

              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                Choose your engineering branch to access study resources.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((item) => {
                const selected = item.id === currentBranch.id;

                return (
                  <Link
                    key={item.id}
                    to={`/branch-resources/${item.id}`}
                    className={`group relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 ${
                      selected
                        ? "border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-200"
                        : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-200 hover:shadow-xl"
                    }`}
                  >
                    <div
                      className={`absolute -right-8 -top-8 h-28 w-28 rounded-full transition ${
                        selected
                          ? "bg-white/10"
                          : "bg-blue-50 group-hover:bg-blue-100"
                      }`}
                    />

                    <div className="relative">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold ${
                          selected
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {item.shortName.slice(0, 2).toUpperCase()}
                      </div>

                      <h3 className="mt-5 text-xl font-extrabold">
                        {item.shortName}
                      </h3>

                      <p
                        className={`mt-2 min-h-10 text-sm leading-6 ${
                          selected ? "text-blue-100" : "text-slate-500"
                        }`}
                      >
                        {item.name}
                      </p>

                      <div className="mt-5">
                        <span
                          className={`inline-flex rounded-xl px-4 py-2 text-sm font-bold ${
                            selected
                              ? "bg-white/20 text-white"
                              : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
                          }`}
                        >
                          {selected ? "✓ Selected" : "View Resources →"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* MAIN RESOURCES */}
        <section className="border-t border-slate-200 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">

            {/* LOADING */}
            {loading && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                <p className="mt-5 font-semibold text-slate-700">
                  Resources load ho rahe hain...
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Please wait.
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <div className="text-4xl">⚠️</div>

                <h3 className="mt-4 text-xl font-bold text-red-700">
                  Resources load nahi ho pa rahe
                </h3>

                <p className="mt-3 text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadResources}
                  className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* CONTENT */}
            {!loading && !error && (
              <>
                {/* FILTERS */}
                <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <ResourceFilters
                    search={search}
                    branch={branchFilter}
                    semester={semesterFilter}
                    category={categoryFilter}
                    onSearchChange={setSearch}
                    onBranchChange={setBranchFilter}
                    onSemesterChange={setSemesterFilter}
                    onCategoryChange={setCategoryFilter}
                    onClear={clearFilters}
                    branchOptions={branchFilterOptions}
                  />
                </div>

                {/* FILTER SUMMARY */}
                <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <p className="text-sm text-slate-700 sm:text-base">
                    <span className="font-extrabold text-blue-700">
                      {filteredResources.length}
                    </span>{" "}
                    matching resources found
                  </p>

                  {filtersActive && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-left text-sm font-bold text-blue-700 transition hover:text-blue-900 sm:text-right"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                {/* NO RESULTS */}
                {filteredResources.length === 0 && (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm">
                      🔎
                    </div>

                    <h3 className="mt-5 text-2xl font-extrabold text-slate-800">
                      No Matching Resources
                    </h3>

                    <p className="mt-3 text-sm text-slate-500">
                      Branch, semester, category ya search change karke
                      dobara try karo.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* FOLDERS */}
                {filteredResources.length > 0 && !selectedFolder && (
                  <>
                    <div className="mb-8">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                        Study Material
                      </span>

                      <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                        {currentBranch.shortName} Resources
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        Select a folder to explore available files.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {resourceFolders.map((folder) => {
                        const count = getFolderCount(folder.id);

                        return (
                          <button
                            key={folder.id}
                            type="button"
                            onClick={() => setSelectedFolder(folder.id)}
                            className={`group relative overflow-hidden rounded-3xl border p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${folder.cardBg} ${folder.cardHover} ${folder.border}`}
                          >
                            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40 transition group-hover:scale-125" />

                            <div className="relative">
                              <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm ${folder.iconBg}`}
                              >
                                {folder.icon}
                              </div>

                              <h3 className="mt-5 text-xl font-extrabold text-slate-800">
                                {folder.name}
                              </h3>

                              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                                {folder.description}
                              </p>

                              <div className="mt-5 flex items-center justify-between gap-2">
                                <span
                                  className={`rounded-full px-4 py-2 text-xs font-extrabold ${folder.countBg}`}
                                >
                                  {count} {count === 1 ? "File" : "Files"}
                                </span>

                                <span
                                  className={`text-sm font-extrabold ${folder.accent}`}
                                >
                                  Open →
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* FOLDER VIEW */}
                {selectedFolder && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedFolder(null)}
                      className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      ← Back to Folders
                    </button>

                    {/* FOLDER HEADER */}
                    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div
                          className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-4xl ${
                            selectedFolderInfo?.iconBg || "bg-blue-100"
                          }`}
                        >
                          {selectedFolderInfo?.icon || "📁"}
                        </div>

                        <div>
                          <span
                            className={`text-xs font-bold uppercase tracking-widest ${
                              selectedFolderInfo?.accent || "text-blue-700"
                            }`}
                          >
                            {currentBranch.shortName} Study Material
                          </span>

                          <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                            {selectedFolderInfo?.name}
                          </h2>

                          <p className="mt-2 text-sm text-slate-500">
                            {currentBranch.name} resources
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            Total Files: {currentFolderResources.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FOLDER EMPTY */}
                    {currentFolderResources.length === 0 && (
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
                        <div className="text-5xl">📂</div>

                        <h3 className="mt-5 text-xl font-extrabold text-slate-800">
                          No Matching Files
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          Search ya semester filter change karke dobara
                          try karo.
                        </p>

                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}

                    {/* RESOURCE CARDS */}
                    {currentFolderResources.length > 0 && (
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {currentFolderResources.map((resource) => (
                          <article
                            key={resource._id}
                            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                          >
                            <div
                              className={`h-2 ${
                                selectedFolder === "Notes"
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                  : selectedFolder === "PYQ"
                                  ? "bg-gradient-to-r from-orange-500 to-amber-400"
                                  : selectedFolder === "Syllabus"
                                  ? "bg-gradient-to-r from-purple-500 to-indigo-400"
                                  : "bg-gradient-to-r from-teal-500 to-emerald-400"
                              }`}
                            />

                            <div className="flex flex-1 flex-col p-5 sm:p-6">

                              {/* CARD HEADER */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                                  📄
                                </div>

                                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                                  PDF
                                </span>
                              </div>

                              {/* CORRECTED TITLE */}
                              <h3 className="mt-5 break-words text-lg font-extrabold leading-6 text-slate-800 transition group-hover:text-blue-700 sm:text-xl">
                                {getResourceTitle(resource)}
                              </h3>

                              {/* FILE NAME */}
                              {resource.fileName && (
                                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    File Name
                                  </p>

                                  <p
                                    className="mt-1 truncate text-sm font-medium text-slate-700"
                                    title={resource.fileName}
                                  >
                                    {resource.fileName}
                                  </p>
                                </div>
                              )}

                              {/* RESOURCE DETAILS */}
                              {(resource.subject ||
                                resource.semester ||
                                resource.branch) && (
                                <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4">
                                  {resource.subject && (
                                    <div>
                                      <p className="text-xs font-semibold text-slate-400">
                                        Subject
                                      </p>

                                      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                                        {resource.subject}
                                      </p>
                                    </div>
                                  )}

                                  {resource.semester && (
                                    <div>
                                      <p className="text-xs font-semibold text-slate-400">
                                        Semester
                                      </p>

                                      <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {resource.semester}
                                      </p>
                                    </div>
                                  )}

                                  {resource.branch && (
                                    <div>
                                      <p className="text-xs font-semibold text-slate-400">
                                        Branch
                                      </p>

                                      <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {resource.branch}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* DESCRIPTION */}
                              {resource.description && (
                                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                                  {resource.description}
                                </p>
                              )}

                              {/* UPLOAD DATE */}
                              {resource.createdAt && (
                                <p className="mt-4 text-xs font-medium text-slate-400">
                                  Uploaded: {formatDate(resource.createdAt)}
                                </p>
                              )}

                              {/* ACTIONS */}
                              <div className="mt-auto pt-5">
                                <BookmarkButton
                                  resourceId={resource._id}
                                  bookmarked={bookmarkedIds.includes(
                                    resource._id
                                  )}
                                  onChange={handleBookmarkChange}
                                />

                                <div className="mt-3 grid grid-cols-2 gap-3">
                                  {resource.fileUrl ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openPdf(resource.fileUrl)
                                        }
                                        className={`rounded-xl px-3 py-3 text-sm font-bold text-white shadow-sm transition hover:shadow-md active:scale-[0.98] ${
                                          selectedFolderInfo?.button ||
                                          "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                      >
                                        ↗ Open PDF
                                      </button>

                                      <a
                                        href={resource.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={resource.fileName || undefined}
                                        className="rounded-xl bg-slate-900 px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                                      >
                                        ↓ Download
                                      </a>
                                    </>
                                  ) : (
                                    <div className="col-span-2 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-400">
                                      PDF unavailable
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
