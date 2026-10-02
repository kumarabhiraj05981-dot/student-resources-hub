import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BookmarkButton from "../components/bookmarks/BookmarkButton";
import ResourceFilters from "../components/resources/ResourceFilters";
import api from "../services/api";

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

/* =========================================================
   BRANCHES
========================================================= */

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

/* =========================================================
   DATABASE BRANCH NAMES
========================================================= */

const branchApiNames: Record<string, string> = {
  cse: "Computer Science",
  electrical: "Electrical",
  mechanical: "Mechanical",
  "civil-ctm": "Civil & CTM",
  electronics: "Electronics",
  leather: "Leather Technology",
};

/* =========================================================
   BRANCH FILTER OPTIONS
========================================================= */

const branchFilterOptions = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Leather Technology",
];

/* =========================================================
   RESOURCE FOLDERS
========================================================= */

const resourceFolders = [
  {
    id: "Notes",
    name: "Notes",
    description:
      "Study notes, unit notes and subject-wise learning material.",
    iconBg: "bg-blue-100",
    iconText: "text-blue-700",
    cardBg: "bg-blue-50",
    cardHover: "hover:bg-blue-100",
    border: "border-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "PYQ",
    name: "PYQ",
    description:
      "Previous year question papers and exam papers.",
    iconBg: "bg-orange-100",
    iconText: "text-orange-700",
    cardBg: "bg-orange-50",
    cardHover: "hover:bg-orange-100",
    border: "border-orange-200",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  {
    id: "Syllabus",
    name: "Syllabus",
    description:
      "Semester-wise syllabus and course documents.",
    iconBg: "bg-purple-100",
    iconText: "text-purple-700",
    cardBg: "bg-purple-50",
    cardHover: "hover:bg-purple-100",
    border: "border-purple-200",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "Ebooks",
    name: "E-Books",
    description:
      "Useful books and learning material in PDF format.",
    iconBg: "bg-green-100",
    iconText: "text-green-700",
    cardBg: "bg-green-50",
    cardHover: "hover:bg-green-100",
    border: "border-green-200",
    button: "bg-green-600 hover:bg-green-700",
  },
];

/* =========================================================
   SEMESTER ALIASES
========================================================= */

const semesterAliases: Record<string, string[]> = {
  "1": [
    "1",
    "1st",
    "1st semester",
    "semester 1",
    "semester-1",
  ],
  "2": [
    "2",
    "2nd",
    "2nd semester",
    "semester 2",
    "semester-2",
  ],
  "3": [
    "3",
    "3rd",
    "3rd semester",
    "semester 3",
    "semester-3",
  ],
  "4": [
    "4",
    "4th",
    "4th semester",
    "semester 4",
    "semester-4",
  ],
  "5": [
    "5",
    "5th",
    "5th semester",
    "semester 5",
    "semester-5",
  ],
  "6": [
    "6",
    "6th",
    "6th semester",
    "semester 6",
    "semester-6",
  ],
  "7": [
    "7",
    "7th",
    "7th semester",
    "semester 7",
    "semester-7",
  ],
  "8": [
    "8",
    "8th",
    "8th semester",
    "semester 8",
    "semester-8",
  ],
};

/* =========================================================
   NORMALIZE HELPER
========================================================= */

const normalize = (value?: string) => {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

/* =========================================================
   BRANCH MATCHING
========================================================= */

const matchesBranch = (
  resourceBranch: string,
  selectedBranch: string
) => {
  const resource = normalize(resourceBranch);
  const selected = normalize(selectedBranch);

  if (!resource || !selected) {
    return false;
  }

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
    return [
      "electrical",
      "electrical engineering",
      "eee",
    ].includes(resource);
  }

  if (selected === "mechanical") {
    return [
      "mechanical",
      "mechanical engineering",
      "me",
    ].includes(resource);
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
    return [
      "leather technology",
      "leather",
    ].includes(resource);
  }

  return resource === selected;
};

/* =========================================================
   SEMESTER MATCHING
========================================================= */

const matchesSemester = (
  resourceSemester: string,
  selectedSemester: string
) => {
  if (!selectedSemester) {
    return true;
  }

  const resourceValue = normalize(resourceSemester);

  const aliases =
    semesterAliases[selectedSemester] || [
      normalize(selectedSemester),
    ];

  return aliases.includes(resourceValue);
};

/* =========================================================
   COMPONENT
========================================================= */

export default function BranchResources() {
  const { branchId } = useParams();

  const currentBranch =
    branches.find((item) => item.id === branchId) ||
    branches[0];

  const apiBranchName =
    branchApiNames[currentBranch.id] ||
    "Computer Science";

  /* =======================================================
     STATE
  ======================================================= */

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [selectedFolder, setSelectedFolder] =
    useState<string | null>(null);

  const [bookmarkedIds, setBookmarkedIds] =
    useState<string[]>([]);

  /* =======================================================
     LOAD RESOURCES
  ======================================================= */

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

  /* =======================================================
     LOAD BOOKMARKS
  ======================================================= */

  const loadBookmarks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setBookmarkedIds([]);
      return;
    }

    try {
      const response = await api.get(
        "/api/bookmarks/ids",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookmarkedIds(
        response.data?.resourceIds || []
      );
    } catch (err) {
      console.error(
        "BOOKMARK LOAD ERROR:",
        err
      );

      setBookmarkedIds([]);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadResources();
    loadBookmarks();
  }, []);

  /* =======================================================
     RESET WHEN URL BRANCH CHANGES
  ======================================================= */

  useEffect(() => {
    setSelectedFolder(null);
    setSearch("");
    setBranchFilter("");
    setSemesterFilter("");
    setCategoryFilter("");
  }, [currentBranch.id]);

  /* =======================================================
     BOOKMARK CHANGE
  ======================================================= */

  const handleBookmarkChange = (
    resourceId: string,
    bookmarked: boolean
  ) => {
    setBookmarkedIds((previous) => {
      if (bookmarked) {
        if (previous.includes(resourceId)) {
          return previous;
        }

        return [...previous, resourceId];
      }

      return previous.filter(
        (id) => id !== resourceId
      );
    });
  };

  /* =======================================================
     CURRENT BRANCH RESOURCES
  ======================================================= */

  const branchResources = useMemo(() => {
    return resources.filter((resource) =>
      matchesBranch(
        resource.branch || "",
        apiBranchName
      )
    );
  }, [resources, apiBranchName]);

  /* =======================================================
     FILTERED RESOURCES
  ======================================================= */

  const filteredResources = useMemo(() => {
    const searchValue = normalize(search);

    return branchResources.filter((resource) => {
      /* -----------------------------------------------
         SEARCH
      ------------------------------------------------ */

      const matchesSearch =
        !searchValue ||
        normalize(resource.title).includes(
          searchValue
        ) ||
        normalize(resource.description).includes(
          searchValue
        ) ||
        normalize(resource.subject).includes(
          searchValue
        ) ||
        normalize(resource.branch).includes(
          searchValue
        ) ||
        normalize(resource.semester).includes(
          searchValue
        ) ||
        normalize(resource.category).includes(
          searchValue
        ) ||
        normalize(resource.fileName).includes(
          searchValue
        );

      /* -----------------------------------------------
         BRANCH
      ------------------------------------------------ */

      const matchesSelectedBranch =
        !branchFilter ||
        matchesBranch(
          resource.branch || "",
          branchFilter
        );

      /* -----------------------------------------------
         SEMESTER
      ------------------------------------------------ */

      const matchesSelectedSemester =
        matchesSemester(
          resource.semester || "",
          semesterFilter
        );

      /* -----------------------------------------------
         CATEGORY
      ------------------------------------------------ */

      const matchesSelectedCategory =
        !categoryFilter ||
        normalize(resource.category) ===
          normalize(categoryFilter);

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

  /* =======================================================
     FOLDER RESOURCES
  ======================================================= */

  const currentFolderResources = useMemo(() => {
    if (!selectedFolder) {
      return [];
    }

    return filteredResources.filter(
      (resource) =>
        normalize(resource.category) ===
        normalize(selectedFolder)
    );
  }, [
    filteredResources,
    selectedFolder,
  ]);

  /* =======================================================
     FOLDER COUNT
  ======================================================= */

  const getFolderCount = (folderId: string) => {
    return branchResources.filter(
      (resource) =>
        normalize(resource.category) ===
        normalize(folderId)
    ).length;
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setBranchFilter("");
    setSemesterFilter("");
    setCategoryFilter("");
  };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (date?: string) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  /* =======================================================
     OPEN PDF
  ======================================================= */

  const openPdf = (url?: string) => {
    if (!url) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     SELECTED FOLDER
  ======================================================= */

  const selectedFolderInfo =
    resourceFolders.find(
      (folder) =>
        folder.id === selectedFolder
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Navbar />

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-16">

          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            {currentBranch.name}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base text-blue-100 sm:text-lg">
            {currentBranch.description}
          </p>

          {!loading && (
            <div className="mt-6 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold sm:px-6 sm:text-base">
              {branchResources.length} Resources Available
            </div>
          )}

        </div>
      </section>

      {/* ===================================================
          BRANCH SELECTOR
      =================================================== */}

      <section className="bg-blue-50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="mb-8 text-center sm:mb-10">

            <h2 className="text-2xl font-bold text-blue-700 sm:text-3xl md:text-4xl">
              Select Your Branch
            </h2>

            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Choose your engineering branch to access study resources.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

            {branches.map((item) => {
              const selected =
                item.id === currentBranch.id;

              return (
                <Link
                  key={item.id}
                  to={`/branch-resources/${item.id}`}
                  className={`block rounded-2xl p-5 transition duration-300 hover:-translate-y-1 sm:p-6 sm:hover:-translate-y-2 ${
                    selected
                      ? "bg-blue-600 text-white shadow-2xl"
                      : "bg-white text-gray-800 shadow-lg hover:shadow-2xl"
                  }`}
                >

                  <h3 className="text-xl font-bold">
                    {item.shortName}
                  </h3>

                  <p
                    className={`mt-2 text-sm ${
                      selected
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </p>

                  <div className="mt-5">

                    <span
                      className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
                        selected
                          ? "bg-white/20 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {selected
                        ? "Selected"
                        : "View Resources"}
                    </span>

                  </div>

                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* ===================================================
          MAIN
      =================================================== */}

      <section className="bg-white py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="py-20 text-center">

              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

              <p className="mt-5 font-medium text-gray-600">
                Resources load ho rahe hain...
              </p>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8">

              <h3 className="text-xl font-bold text-red-700">
                Resources load nahi ho pa rahe
              </h3>

              <p className="mt-3 text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={loadResources}
                className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              CONTENT
          ================================================= */}

          {!loading && !error && (
            <>

              {/* =============================================
                  FILTERS
              ============================================== */}

              <ResourceFilters
                search={search}
                branch={branchFilter}
                semester={semesterFilter}
                category={categoryFilter}
                onSearchChange={setSearch}
                onBranchChange={setBranchFilter}
                onSemesterChange={
                  setSemesterFilter
                }
                onCategoryChange={
                  setCategoryFilter
                }
                onClear={clearFilters}
                branchOptions={
                  branchFilterOptions
                }
              />

              {/* =============================================
                  FILTER RESULT
              ============================================== */}

              <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-gray-700 sm:text-base">
                    <strong>
                      {filteredResources.length}
                    </strong>{" "}
                    matching resources found
                  </p>

                  {(search ||
                    branchFilter ||
                    semesterFilter ||
                    categoryFilter) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-left text-sm font-semibold text-blue-700 hover:text-blue-900 sm:text-right"
                    >
                      Clear Filters
                    </button>
                  )}

                </div>

              </div>

              {/* =============================================
                  NO RESULTS
              ============================================== */}

              {filteredResources.length === 0 && (
                <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center sm:p-12">

                  <div className="mb-5 text-5xl">
                    🔎
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    No Matching Resources
                  </h3>

                  <p className="mt-3 text-gray-600">
                    Branch, semester, category ya search change karke dobara try karo.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Clear All Filters
                  </button>

                </div>
              )}

              {/* =============================================
                  FOLDERS
              ============================================== */}

              {filteredResources.length > 0 &&
                !selectedFolder && (
                  <>

                    <div className="mb-10 text-center sm:mb-12">

                      <h2 className="text-2xl font-bold text-blue-700 sm:text-3xl md:text-4xl">
                        {currentBranch.shortName} Resources
                      </h2>

                      <p className="mt-3 text-gray-600">
                        Select a folder to view files.
                      </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4">

                      {resourceFolders.map(
                        (folder) => {
                          const count =
                            getFolderCount(
                              folder.id
                            );

                          return (
                            <button
                              key={folder.id}
                              type="button"
                              onClick={() => {
                                setSelectedFolder(
                                  folder.id
                                );
                              }}
                              className={`rounded-3xl border-2 p-6 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 sm:hover:-translate-y-2 ${folder.cardBg} ${folder.cardHover} ${folder.border}`}
                            >

                              <div
                                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${folder.iconBg}`}
                              >
                                <span
                                  className={`text-2xl font-bold ${folder.iconText}`}
                                >
                                  PDF
                                </span>
                              </div>

                              <h3 className="mt-6 text-2xl font-bold text-gray-800">
                                {folder.name}
                              </h3>

                              <p className="mt-3 text-sm text-gray-600">
                                {
                                  folder.description
                                }
                              </p>

                              <div className="mt-6">

                                <span className="inline-block rounded-full bg-white px-5 py-2 text-sm font-bold text-gray-700 shadow">
                                  {count}{" "}
                                  {count === 1
                                    ? "File"
                                    : "Files"}
                                </span>

                              </div>

                              <div className="mt-5 font-bold text-blue-700">
                                Open Folder →
                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>

                  </>
                )}

              {/* =============================================
                  FOLDER VIEW
              ============================================== */}

              {selectedFolder && (
                <>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFolder(null);
                    }}
                    className="mb-6 rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-200"
                  >
                    ← Back to Folders
                  </button>

                  {/* FOLDER HEADER */}

                  <div className="mb-10 text-center sm:mb-12">

                    <div
                      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl sm:h-24 sm:w-24 ${
                        selectedFolderInfo?.iconBg ||
                        "bg-blue-100"
                      }`}
                    >

                      <span
                        className={`text-2xl font-bold sm:text-3xl ${
                          selectedFolderInfo?.iconText ||
                          "text-blue-700"
                        }`}
                      >
                        PDF
                      </span>

                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-blue-700 sm:text-3xl md:text-4xl">
                      {selectedFolderInfo?.name}
                    </h2>

                    <p className="mt-3 text-gray-600">
                      {currentBranch.name} ke{" "}
                      {selectedFolderInfo?.name}{" "}
                      resources
                    </p>

                    <p className="mt-2 text-gray-500">
                      Total Files:{" "}
                      <strong>
                        {
                          currentFolderResources.length
                        }
                      </strong>
                    </p>

                  </div>

                  {/* FOLDER EMPTY */}

                  {currentFolderResources.length ===
                    0 && (
                    <div className="mx-auto max-w-2xl rounded-3xl bg-blue-50 p-8 text-center shadow-lg sm:p-10">

                      <div className="mb-4 text-5xl">
                        🔎
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800">
                        No Matching Files
                      </h3>

                      <p className="mt-3 text-gray-600">
                        Search ya semester filter change karke dobara try karo.
                      </p>

                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        Clear Filters
                      </button>

                    </div>
                  )}

                  {/* RESOURCE CARDS */}

                  {currentFolderResources.length >
                    0 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                      {currentFolderResources.map(
                        (resource) => (
                          <div
                            key={resource._id}
                            className="flex flex-col rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6"
                          >

                            {/* HEADER */}

                            <div className="flex items-start justify-between gap-4">

                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-100 sm:h-16 sm:w-16">
                                <span className="font-bold text-red-700">
                                  PDF
                                </span>
                              </div>

                              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                                PDF
                              </span>

                            </div>

                            {/* TITLE */}

                            <h3 className="mt-5 break-words text-lg font-bold text-gray-800 sm:text-xl">
                              {resource.title}
                            </h3>

                            {/* FILE NAME */}

                            {resource.fileName && (
                              <p className="mt-2 break-all text-xs text-gray-500">
                                File:{" "}
                                {resource.fileName}
                              </p>
                            )}

                            {/* SUBJECT */}

                            {resource.subject && (
                              <p className="mt-3 text-sm text-gray-600">
                                <strong>
                                  Subject:
                                </strong>{" "}
                                {resource.subject}
                              </p>
                            )}

                            {/* SEMESTER */}

                            {resource.semester && (
                              <p className="mt-1 text-sm text-gray-600">
                                <strong>
                                  Semester:
                                </strong>{" "}
                                {resource.semester}
                              </p>
                            )}

                            {/* BRANCH */}

                            {resource.branch && (
                              <p className="mt-1 text-sm text-gray-600">
                                <strong>
                                  Branch:
                                </strong>{" "}
                                {resource.branch}
                              </p>
                            )}

                            {/* DESCRIPTION */}

                            {resource.description && (
                              <p className="mt-3 line-clamp-3 text-sm text-gray-500">
                                {
                                  resource.description
                                }
                              </p>
                            )}

                            {/* DATE */}

                            {resource.createdAt && (
                              <p className="mt-4 text-xs text-gray-400">
                                Uploaded:{" "}
                                {formatDate(
                                  resource.createdAt
                                )}
                              </p>
                            )}

                            {/* ACTIONS */}

                            <div className="mt-auto pt-6">

                              <BookmarkButton
                                resourceId={
                                  resource._id
                                }
                                bookmarked={bookmarkedIds.includes(
                                  resource._id
                                )}
                                onChange={
                                  handleBookmarkChange
                                }
                              />

                              <div className="mt-3 flex flex-col gap-3 sm:flex-row">

                                {resource.fileUrl ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openPdf(
                                          resource.fileUrl
                                        )
                                      }
                                      className={`w-full rounded-xl px-4 py-3 font-bold text-white transition sm:flex-1 ${
                                        selectedFolderInfo?.button ||
                                        "bg-blue-600 hover:bg-blue-700"
                                      }`}
                                    >
                                      Open PDF →
                                    </button>

                                    <a
                                      href={
                                        resource.fileUrl
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full rounded-xl bg-gray-900 px-4 py-3 text-center font-bold text-white transition hover:bg-gray-800 sm:flex-1"
                                    >
                                      Download
                                    </a>
                                  </>
                                ) : (
                                  <div className="w-full rounded-xl bg-gray-200 px-5 py-3 text-center font-semibold text-gray-500">
                                    PDF unavailable
                                  </div>
                                )}

                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </>
              )}

            </>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}