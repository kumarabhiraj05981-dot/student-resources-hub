export default function SearchBar() {
  return (
    <div className="max-w-4xl mx-auto -mt-10 relative z-10">
      <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Search Notes, PYQ, E-books..."
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select className="border rounded-xl px-4 py-3">
          <option>Semester</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
        </select>

        <button className="bg-blue-600 text-white px-8 rounded-xl hover:bg-blue-700">
          Search
        </button>
      </div>
    </div>
  );
}