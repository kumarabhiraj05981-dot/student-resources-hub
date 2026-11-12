
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const resources = [
  {
    title: "Study Notes",
    short: "NOTES",
    description: "Semester-wise notes, important topics and study material for your subjects.",
    path: "/notes",
    number: "01",
    color: "from-blue-500 to-cyan-500",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    title: "Previous Year Questions",
    short: "PYQ",
    description: "Previous examination papers to understand question patterns and practice.",
    path: "/pyq",
    number: "02",
    color: "from-orange-500 to-amber-500",
    glow: "group-hover:shadow-orange-500/20",
  },
  {
    title: "Syllabus",
    short: "SYLLABUS",
    description: "Find your branch and semester-wise syllabus in one place.",
    path: "/syllabus",
    number: "03",
    color: "from-purple-500 to-pink-500",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    title: "E-Books",
    short: "BOOKS",
    description: "Access useful educational books and reference material for learning.",
    path: "/ebooks",
    number: "04",
    color: "from-emerald-500 to-teal-500",
    glow: "group-hover:shadow-emerald-500/20",
  },
];

const branches = [
  {
    name: "Computer Science",
    description: "Programming, DSA, DBMS, Networks and more.",
    path: "/branch-resources/cse",
    code: "CSE",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Electrical Engineering",
    description: "Circuits, machines and power systems.",
    path: "/branch-resources/electrical",
    code: "EE",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Mechanical Engineering",
    description: "Manufacturing, mechanics and thermodynamics.",
    path: "/branch-resources/mechanical",
    code: "ME",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Civil / CTM",
    description: "Civil and CTM semester resources.",
    path: "/branch-resources/civil-ctm",
    code: "CE",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Electronics",
    description: "Communication and digital systems.",
    path: "/branch-resources/electronics",
    code: "EC",
    color: "from-rose-500 to-red-500",
  },
  {
    name: "Leather Technology",
    description: "Processing, chemistry and technology resources.",
    path: "/branch-resources/leather-technology",
    code: "LT",
    color: "from-indigo-500 to-violet-500",
  },
];

const tools = [
  {
    title: "Study Planner",
    description: "Organize your daily study tasks and keep your preparation on track.",
    path: "/study-planner",
    button: "Open Planner",
    number: "01",
    icon: "SP",
  },
  {
    title: "Study Assistant",
    description: "Get assistance with difficult topics and study-related questions.",
    path: "/study-assistant",
    button: "Ask Assistant",
    number: "02",
    icon: "AI",
  },
  {
    title: "AI Question Paper",
    description: "Generate practice question papers for your exam preparation.",
    path: "/ai-question-paper",
    button: "Create Paper",
    number: "03",
    icon: "QP",
  },
];

const features = [
  "Semester-wise Study Material",
  "Previous Year Question Papers",
  "Branch-wise Syllabus",
  "Educational E-Books",
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[#07152e] px-5 py-24 sm:py-28 lg:py-32">

          {/* CSS DECORATIONS */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />

          <div className="relative mx-auto max-w-6xl">

            <div className="mx-auto max-w-4xl text-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Student Learning Platform
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                Learn Smarter.
                <span className="mt-2 block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Prepare Better.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Your academic journey deserves better resources.
                Access study notes, previous year questions, syllabus,
                e-books and smart learning tools in one place.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

                <Link
                  to="/notes"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-600/25 transition duration-300 hover:-translate-y-1 hover:shadow-blue-500/40"
                >
                  Explore Resources →
                </Link>

                <Link
                  to="/branch-resources"
                  className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-white/10"
                >
                  Browse Your Branch
                </Link>

              </div>

            </div>

            {/* OVERVIEW CARDS */}
            <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-3 sm:gap-5">

              {[
                { value: "04", label: "Resource Types" },
                { value: "06", label: "Branches" },
                { value: "03", label: "Study Tools" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <p className="text-3xl font-black text-white sm:text-4xl">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                    {item.label}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-12 text-center text-xs font-medium tracking-widest text-slate-500">
              ONE PLATFORM • MULTIPLE LEARNING RESOURCES
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-12">

              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />

              <div className="relative">

                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
                  About Our Platform
                </span>

                <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Everything Academic.
                  <span className="block text-blue-600">
                    Organized in One Place.
                  </span>
                </h2>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-500 sm:text-base">
                  Student Resources Hub is designed to make learning
                  easier and more organized. Find useful academic
                  resources, prepare for semester examinations and
                  improve your knowledge with helpful study tools.
                </p>

                <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {features.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-black text-emerald-600">
                        ✓
                      </span>
                      <span className="text-xs font-bold leading-5 text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}

                </div>

              </div>
            </div>

          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className="px-5 pb-20">

          <div className="mx-auto max-w-6xl">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
                  Quick Access
                </span>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Explore Resources
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  Everything you need for your academic preparation.
                </p>
              </div>

              <Link
                to="/notes"
                className="text-sm font-extrabold text-blue-600 transition hover:text-indigo-600"
              >
                View All Resources →
              </Link>

            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  to={resource.path}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${resource.glow}`}
                >

                  <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${resource.color}`} />

                  <div className="flex items-center justify-between">

                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${resource.color} text-xs font-black tracking-widest text-white shadow-lg`}>
                      {resource.short}
                    </span>

                    <span className="text-3xl font-black text-slate-100 transition group-hover:text-slate-200">
                      {resource.number}
                    </span>

                  </div>

                  <h3 className="mt-7 text-lg font-extrabold text-slate-900 transition group-hover:text-blue-600">
                    {resource.title}
                  </h3>

                  <p className="mt-3 min-h-[76px] text-sm leading-7 text-slate-500">
                    {resource.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                    <span className="text-sm font-extrabold text-blue-600">
                      Explore Now
                    </span>

                    <span className="transition duration-300 group-hover:translate-x-2">
                      →
                    </span>

                  </div>

                </Link>
              ))}

            </div>

          </div>
        </section>

        {/* BRANCH SECTION */}
        <section className="border-y border-slate-200 bg-white px-5 py-20 sm:py-24">

          <div className="mx-auto max-w-6xl">

            <div className="text-center">

              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
                Branch-wise Learning
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Choose Your Branch
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Select your engineering branch and explore
                academic resources organized for your studies.
              </p>

            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {branches.map((branch) => (
                <Link
                  key={branch.name}
                  to={branch.path}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:bg-white hover:shadow-xl"
                >

                  <div className="flex items-center justify-between">

                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${branch.color} text-sm font-black text-white shadow-lg`}>
                      {branch.code}
                    </span>

                    <span className="text-2xl text-slate-300 transition duration-300 group-hover:translate-x-2 group-hover:text-indigo-600">
                      →
                    </span>

                  </div>

                  <h3 className="mt-6 text-lg font-extrabold text-slate-900 transition group-hover:text-indigo-600">
                    {branch.name}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-7 text-slate-500">
                    {branch.description}
                  </p>

                  <div className="mt-6 border-t border-slate-200 pt-5 text-sm font-extrabold text-indigo-600">
                    Explore Branch Resources →
                  </div>

                </Link>
              ))}

            </div>

          </div>
        </section>

        {/* STUDY TOOLS */}
        <section className="px-5 py-20 sm:py-24">

          <div className="mx-auto max-w-6xl">

            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
              Smart Learning Tools
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Upgrade Your Study Routine
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Useful academic tools to organize your preparation
              and practice more effectively.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">

              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  to={tool.path}
                  className={`group rounded-2xl border p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    tool.number === "03"
                      ? "border-indigo-200 bg-gradient-to-br from-indigo-950 to-blue-950 text-white shadow-lg shadow-indigo-900/10"
                      : "border-slate-200 bg-white text-slate-900 shadow-sm"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black ${
                      tool.number === "03"
                        ? "bg-white/10 text-blue-300"
                        : "bg-blue-50 text-blue-600"
                    }`}>
                      {tool.icon}
                    </span>

                    <span className={`text-3xl font-black ${
                      tool.number === "03"
                        ? "text-white/10"
                        : "text-slate-100"
                    }`}>
                      {tool.number}
                    </span>

                  </div>

                  <h3 className="mt-7 text-xl font-extrabold">
                    {tool.title}
                  </h3>

                  <p className={`mt-3 min-h-[76px] text-sm leading-7 ${
                    tool.number === "03"
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}>
                    {tool.description}
                  </p>

                  <div className={`mt-6 border-t pt-5 text-sm font-extrabold ${
                    tool.number === "03"
                      ? "border-white/10 text-blue-300"
                      : "border-slate-100 text-blue-600"
                  }`}>
                    {tool.button} →
                  </div>

                </Link>
              ))}

            </div>

          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-5 pb-20">

          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#07152e] px-7 py-16 text-center shadow-2xl sm:px-12">

            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-600/30 blur-3xl" />

            <div className="relative">

              <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                Start Learning Today
              </span>

              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">
                Your Success Starts
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  With Better Preparation.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                Explore academic resources, practice previous year
                questions and make your learning journey easier
                with Student Resources Hub.
              </p>

              <Link
                to="/notes"
                className="mt-9 inline-flex rounded-xl bg-white px-9 py-4 text-sm font-extrabold text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
              >
                Get Started →
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
