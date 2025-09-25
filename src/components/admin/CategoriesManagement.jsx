import React, { useEffect, useState } from "react";
import API from "@/utils/api";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [subName, setSubName] = useState("");
  const [editingSub, setEditingSub] = useState(null);
  const [subs, setSubs] = useState({});
  const [showSubFor, setShowSubFor] = useState(null);

  // Fetch categories + subcategories
  const fetchCategories = async () => {
    try {
      const { data: cats } = await API.get("/categories");
      const subsData = {};

      await Promise.all(
        cats.map(async (cat) => {
          try {
            const { data } = await API.get(`/categories/${cat._id}/subcategories`);
            subsData[cat._id] = data;
          } catch {
            subsData[cat._id] = [];
          }
        })
      );

      setCategories(cats);
      setSubs(subsData);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- CATEGORY CRUD ---
  const createOrUpdateCategory = async () => {
    if (!name.trim()) return alert("Category name required");
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, { name: name.trim() });
      } else {
        await API.post("/categories", { name: name.trim() });
      }
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save category");
    }
  };

  const removeCategory = async (id) => {
    if (!confirm("Delete category and its subcategories?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  // --- SUBCATEGORY CRUD ---
  const addOrUpdateSubcategory = async () => {
    if (!subName.trim()) return alert("Subcategory name required");

    try {
      if (editingSub?.id) {
        await API.put(`/categories/subcategories/${editingSub.id}`, { name: subName.trim() });
        setEditingSub(null);
      } else {
        await API.post(`/categories/${showSubFor}/subcategories`, { name: subName.trim() });
        setShowSubFor(null);
      }
      setSubName("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save subcategory");
    }
  };

  const removeSubcategory = async (subId) => {
    if (!confirm("Delete subcategory?")) return;
    try {
      await API.delete(`/categories/subcategories/${subId}`);
      fetchCategories();
    } catch {
      alert("Failed to delete subcategory");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📂 Manage Categories & Subcategories</h2>

      {/* CATEGORY FORM */}
      <div className="mb-4 p-4 bg-white rounded shadow flex gap-2 flex-wrap">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={createOrUpdateCategory}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
            className="px-3 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Subcategories</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="p-3">{cat._id.slice(-6)}</td>
                <td className="p-3 font-semibold">{cat.name}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {(subs[cat._id] || []).map((s) => (
                      <span
                        key={s._id}
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded flex items-center gap-2"
                      >
                        {s.name}
                        <button
                          onClick={() => {
                            setEditingSub({ id: s._id, catId: cat._id });
                            setSubName(s.name);
                          }}
                          className="text-yellow-600 text-xs"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => removeSubcategory(s._id)}
                          className="text-red-600 text-xs"
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>

                  {(editingSub?.catId === cat._id || showSubFor === cat._id) && (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        placeholder="Subcategory name"
                        className="border p-1 rounded"
                      />
                      <button
                        onClick={addOrUpdateSubcategory}
                        className={`px-3 py-1 text-white rounded ${
                          editingSub?.catId === cat._id ? "bg-yellow-600" : "bg-green-600"
                        }`}
                      >
                        {editingSub?.catId === cat._id ? "Update" : "Add"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingSub(null);
                          setShowSubFor(null);
                          setSubName("");
                        }}
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {!editingSub?.catId && !showSubFor && (
                    <button
                      onClick={() => setShowSubFor(cat._id)}
                      className="mt-2 text-sm text-indigo-600"
                    >
                      ➕ Add Subcategory
                    </button>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setEditingId(cat._id);
                      setName(cat.name);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeCategory(cat._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
