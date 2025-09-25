import React, { useEffect, useState } from "react";
import API from "@/utils/api";
import AddProductForm from "./AddProductForm";
import dayjs from "dayjs";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: 0,
    stock: 0,
    category: "",
    subcategory: "",
    description: "",
    status: "active",
    image: null,
    existingImage: null,
  });

  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [showSubFor, setShowSubFor] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [editingSub, setEditingSub] = useState(null);

  // --- Fetch products and categories ---
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data: cats } = await API.get("/categories");
      await Promise.all(
        cats.map(async (c) => {
          try {
            const { data } = await API.get(`/categories/${c._id}/subcategories`);
            c.subcategories = data;
          } catch {
            c.subcategories = [];
          }
        })
      );
      setCategories(cats);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --- Category/Subcategory CRUD ---
  const saveCategory = async () => {
    if (!newCatName.trim()) return alert("Category name required");
    try {
      if (editingCat) {
        await API.put(`/categories/${editingCat}`, { name: newCatName });
      } else {
        await API.post("/categories", { name: newCatName });
      }
      setNewCatName("");
      setEditingCat(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save category");
    }
  };

  const deleteCategory = async (catId) => {
    if (!window.confirm("Delete category and its subcategories?")) return;
    try {
      await API.delete(`/categories/${catId}`);
      fetchCategories();
    } catch {
      alert("Failed to delete category");
    }
  };

  const saveSubcategory = async () => {
    if (!newSubName.trim() || !showSubFor) return alert("Subcategory name required");
    try {
      if (editingSub) {
        await API.put(`/categories/subcategories/${editingSub}`, { name: newSubName });
      } else {
        await API.post(`/categories/${showSubFor}/subcategories`, { name: newSubName });
      }
      setNewSubName("");
      setShowSubFor(null);
      setEditingSub(null);
      fetchCategories();
    } catch {
      alert("Failed to save subcategory");
    }
  };

  const deleteSubcategory = async (subId) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      await API.delete(`/categories/subcategories/${subId}`);
      fetchCategories();
    } catch {
      alert("Failed to delete subcategory");
    }
  };

  // --- Product Editing ---
  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      title: p.title || "",
      price: p.price || 0,
      stock: p.stock || 0,
      category: p.category?._id || "",
      subcategory: p.subcategory?._id || "",
      description: p.description || "",
      status: p.status || "active",
      image: null,
      existingImage: p.image || null,
    });
  };

  const saveEdit = async (id) => {
    try {
      if (!editForm.category) {
        alert("Please select a category before saving.");
        return;
      }

      const formData = new FormData();
      Object.entries(editForm).forEach(([key, val]) => {
        if (val !== null && val !== undefined && key !== "existingImage") {
          formData.append(key, val);
        }
      });

      await API.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div>⏳ Loading products...</div>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">🛋️ Manage Products</h2>

      {/* --- Category/Subcategory Management --- */}
      <div className="bg-gray-50 p-4 rounded shadow space-y-4">
        <h3 className="font-semibold text-lg">📂 Categories</h3>

        {/* Add Category */}
        <div className="flex gap-2 flex-wrap">
          <input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name"
            className="border p-2 rounded flex-1 min-w-[200px]"
          />
          <button
            onClick={saveCategory}
            className={`px-3 py-1 rounded text-white ${editingCat ? "bg-yellow-600" : "bg-indigo-600"}`}
          >
            {editingCat ? "Update" : "Add"}
          </button>
          {editingCat && (
            <button
              onClick={() => { setEditingCat(null); setNewCatName(""); }}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Category List */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c._id} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded flex items-center gap-2">
              {c.name}
              <button onClick={() => { setEditingCat(c._id); setNewCatName(c.name); }} className="text-yellow-600 text-xs">✎</button>
              <button onClick={() => deleteCategory(c._id)} className="text-red-600 text-xs">✖</button>
            </span>
          ))}
        </div>

        {/* Subcategories */}
        <h3 className="font-semibold text-lg mt-4">🗂️ Subcategories</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c._id} className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium mb-2">{c.name}</p>
              <div className="flex flex-wrap gap-2 items-center">
                {c.subcategories?.map((s) => (
                  <span key={s._id} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-2">
                    {s.name}
                    <button onClick={() => { setEditingSub(s._id); setShowSubFor(c._id); setNewSubName(s.name); }} className="text-yellow-600 text-xs">✎</button>
                    <button onClick={() => deleteSubcategory(s._id)} className="text-red-600 text-xs">✖</button>
                  </span>
                ))}

                {/* Add/Edit Subcategory */}
                {showSubFor === c._id && (
                  <div className="flex gap-2">
                    <input
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      placeholder="Subcategory name"
                      className="border p-1 rounded"
                    />
                    <button onClick={saveSubcategory} className={`px-3 py-1 rounded text-white ${editingSub ? "bg-yellow-600" : "bg-green-600"}`}>
                      {editingSub ? "Update" : "Add"}
                    </button>
                    <button onClick={() => { setShowSubFor(null); setEditingSub(null); setNewSubName(""); }} className="px-3 py-1 bg-gray-400 text-white rounded">
                      Cancel
                    </button>
                  </div>
                )}

                {!showSubFor && (
                  <button onClick={() => setShowSubFor(c._id)} className="text-sm text-green-700">➕ Add Subcategory</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Add Product Form --- */}
      <AddProductForm onSuccess={fetchProducts} />

      {/* --- Products Table --- */}
      <div className="overflow-x-auto bg-white rounded shadow mt-6">
        <table className="w-full text-sm">
        
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Subcategory</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Added</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                {/* Product */}
                <td className="p-3 flex items-center gap-3">
                  {editingId === p._id ? (
                    <div className="flex flex-col gap-2">
                      {editForm.existingImage && (
                        <img
                          src={
                            editForm.existingImage.startsWith("http")
                              ? editForm.existingImage
                              : `${import.meta.env.VITE_API_URL}/${editForm.existingImage}`
                          }
                          alt="current"
                          className="w-14 h-14 object-cover rounded shadow"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditForm({ ...editForm, image: e.target.files[0] })
                        }
                      />
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    </div>
                  ) : (
                    <>
                      {p.image ? (
                        <img
                          src={
                            p.image.startsWith("http")
                              ? p.image
                              : `${import.meta.env.VITE_API_URL}/${p.image}`
                          }
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-md shadow"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{p.description || "—"}</p>
                      </div>
                    </>
                  )}
                </td>

                {/* Category */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value, subcategory: "" })
                      }
                      className="border p-1 rounded"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    p.category?.name || "—"
                  )}
                </td>

                {/* Subcategory */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <select
                      value={editForm.subcategory}
                      onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                      className="border p-1 rounded"
                    >
                      <option value="">Select subcategory</option>
                      {categories
                        .find((c) => c._id === editForm.category)
                        ?.subcategories?.map((s) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                  ) : (
                    p.subcategory?.name || "—"
                  )}
                </td>

                {/* Price */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="border p-1 rounded w-20"
                    />
                  ) : (
                    `Rs ${p.price}`
                  )}
                </td>

                {/* Stock */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      className="border p-1 rounded w-16"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {p.stock}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="border p-1 rounded"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded font-medium ${p.status === "active" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                      {p.status || "active"}
                    </span>
                  )}
                </td>

                {/* Added Date */}
                <td className="p-3 text-gray-500">{dayjs(p.createdAt).format("DD MMM YYYY")}</td>

                {/* Actions */}
                <td className="p-3 space-x-2">
                  {editingId === p._id ? (
                    <>
                      <button onClick={() => saveEdit(p._id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
