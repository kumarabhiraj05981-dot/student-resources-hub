import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const resources = [
  {
    icon: "",
    title: "Notes",
    description: "Semester-wise notes and study material for your subjects.",
    path: "/notes",
  },
  {
    icon: "",
    title: "Previous Year Questions",
    description: "Practice previous year question papers for better preparation.",
    path: "/pyq",
  },
  {
    icon: "",
    title: "Syllabus",
    description: "Check your branch and semester-wise syllabus easily.",
    path: "/syllabus",
  },
  {
    icon: "",
    title: "E-Books",
    description: "Find useful books and study material in one place.",
    path: "/ebooks",
  },
];

const branches = [
  {
    icon: "",
    name: "Computer Science",
    description: "Programming, DSA, DBMS, Networks and more.",
    path: "/branch/cse",
  },
  {
    icon: "",
    name: "Electrical Engineering",
    description: "Circuits, machines and power systems.",
    path: "/branch/electrical",
  },
  {
    icon: "",
    name: "Mechanical Engineering",
    description: "Manufacturing, mechanics and thermodynamics.",
    path: "/branch/mechanical",
  },
  {
    icon: "",
    name: "Civil / CTM",
    description: "Civil and CTM semester resources.",
    path: "/branch/civil-ctm",
  },
  {
    icon: "",
    name: "Electronics",
    description: "Communication and digital systems.",
    path: "/branch/electronics",
  },
  {
    icon: "",
    name: "Leather Technology",
    description: "Processing, chemistry and technology resources.",
    path: "/branch/leather-technology",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* =========================
            HERO SECTION
        ========================= */}

        <section className="border-b border-gray-200 bg-gradient-to-b from-blue-50 to-white px-5 py-20 sm:py-24">

          <div className="mx-auto max-w-6xl text-center">

        

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-blue-600">
              Student Learning Platform
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Student Resources
              <span className="block text-blue-600">
                Hub
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Find notes, previous year questions, syllabus and
              e-books for your studies — all organized in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <a
                href="/notes"
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
              >
                Explore Resources
              </a>

              <a
                href="/branch-resources"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-bold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                Browse Branches
              </a>

            </div>

          </div>

        </section>


        {/* =========================
            QUICK ACCESS
        ========================= */}

        <section className="px-5 py-16">

          <div className="mx-auto max-w-6xl">

            <div className="text-center">

              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Quick Access
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                What Are You Looking For?
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                Quickly access the study material you need.
              </p>

            </div>


            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {resources.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.path}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                    {resource.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {resource.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {resource.description}
                  </p>

                  <div className="mt-5 text-sm font-bold text-blue-600">
                    Open →
                  </div>

                </a>
              ))}

            </div>

          </div>

        </section>


        {/* =========================
            BRANCH SECTION
        ========================= */}

        <section className="border-y border-gray-200 bg-gray-50 px-5 py-16">

          <div className="mx-auto max-w-6xl">

            <div className="text-center">

              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Branch Resources
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                Choose Your Branch
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                Find study resources according to your engineering branch.
              </p>

            </div>


            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {branches.map((branch) => (
                <a
                  key={branch.name}
                  href={branch.path}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                      {branch.icon}
                    </div>

                    <span className="text-xl text-gray-300 group-hover:text-blue-600">
                      →
                    </span>

                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {branch.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {branch.description}
                  </p>

                  <div className="mt-5 text-sm font-semibold text-blue-600">
                    View Resources →
                  </div>

                </a>
              ))}

            </div>

          </div>

        </section>


        {/* =========================
            STUDENT TOOLS
        ========================= */}

        <section className="px-5 py-16">

          <div className="mx-auto max-w-6xl">

            <div className="text-center">

              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Student Tools
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                Helpful Tools for Your Studies
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                Use these tools to organize your preparation and
                practice effectively.
              </p>

            </div>


            <div className="mt-10 grid gap-5 md:grid-cols-3">

              {/* Study Planner */}

              <a
                href="/study-planner"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Study Planner
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Plan your daily study tasks and keep track of
                  your preparation.
                </p>

                <div className="mt-5 font-bold text-blue-600">
                  Open Planner →
                </div>

              </a>


              {/* AI Assistant */}

              <a
                href="/study-assistant"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Study Assistant
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Get help with difficult topics and study-related
                  questions.
                </p>

                <div className="mt-5 font-bold text-blue-600">
                  Ask Assistant →
                </div>

              </a>


              {/* Question Paper */}

              <a
                href="/ai-question-paper"
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

              

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Question Paper
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Create practice question papers for your exam
                  preparation.
                </p>

                <div className="mt-5 font-bold text-blue-600">
                  Create Paper →
                </div>

              </a>

            </div>

          </div>

        </section>


     


        {/* =========================
            FINAL CTA
        ========================= */}

        <section className="px-5 py-16">

          <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-6 py-12 text-center text-white shadow-lg sm:px-10">

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Start Your Preparation Today
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              Explore study material, practice previous year
              questions and organize your studies in one place.
            </p>

            <a
              href="/notes"
              className="mt-7 inline-block rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Explore Resources →
            </a>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}