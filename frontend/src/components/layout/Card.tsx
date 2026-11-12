import { Link } from "react-router-dom";

type Props = {
  title: string;
  description?: string;
  path?: string;
};

export default function Card({ title, description, path = "/notes" }: Props) {
  return (
    <Link
      to={path}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Student Resources
        </span>

        <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
          →
        </span>
      </div>

      <h2 className="mt-6 text-xl font-bold text-gray-900 transition group-hover:text-blue-600">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {description || "Explore useful study materials and resources."}
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        Explore Now
        <span>→</span>
      </div>
    </Link>
  );
}