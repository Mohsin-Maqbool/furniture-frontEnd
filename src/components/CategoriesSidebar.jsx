// client/src/components/CategoriesSidebar.jsx
import React, { useEffect, useState } from "react";
import API from "@/utils/api";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CategoriesSidebar() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const location = useLocation();

  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>

      <ul className="space-y-3">
        {categories.map((cat) => (
          <li key={cat._id}>
            <div
              onClick={() => toggleExpand(cat._id)}
              className="flex justify-between items-center cursor-pointer py-2 px-3 rounded hover:bg-gray-50"
            >
              <span className="font-medium text-gray-700">{cat.name}</span>
              {expanded[cat._id] ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </div>

            {/* Subcategories */}
            {expanded[cat._id] && cat.subcategories?.length > 0 && (
              <ul className="ml-5 mt-2 space-y-1">
                {cat.subcategories.map((sub) => (
                  <li key={sub._id}>
                    <Link
                      to={`/shop?subcategory=${sub._id}`}
                      className={`block text-sm px-2 py-1 rounded hover:text-indigo-600 hover:bg-gray-100 ${
                        location.search.includes(sub._id)
                          ? "text-indigo-600 font-semibold bg-gray-100"
                          : "text-gray-600"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
