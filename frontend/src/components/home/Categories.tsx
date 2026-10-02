export default function Categories() {
  const items = [
    " Notes",
    " PYQ",
    " Syllabus",
    " E-Books",
  ];

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-3xl font-bold text-center mb-10">
        Resources
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {items.map((item) => (
          <div
            key={item}
            className="bg-white shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition duration-300 cursor-pointer"
          >
            <h3 className="text-xl font-semibold">{item}</h3>
          </div>
        ))}

      </div>

    </section>
  );
}
