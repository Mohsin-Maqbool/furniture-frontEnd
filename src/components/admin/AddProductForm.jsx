// client/src/components/admin/AddProductForm.jsx
import React, { useEffect, useState } from "react";
import API from "@/utils/api";

export default function AddProductForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // fetch categories for dropdown
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("stock", stock || 0);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      if (image) formData.append("image", image);

      // API instance already adds token
      await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setPrice("");
      setStock("");
      setCategory("");
      setSubcategory("");
      setImage(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const selectedCatObj = categories.find((c) => c._id === category);

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white mb-4">
      <h3 className="font-semibold mb-3">➕ Add Product</h3>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="border p-2 rounded" />
        <input required type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" className="border p-2 rounded" />
        <input type="number" value={stock} onChange={(e)=>setStock(e.target.value)} placeholder="Stock" className="border p-2 rounded" />
        <select value={category} onChange={(e)=>{ setCategory(e.target.value); setSubcategory(""); }} className="border p-2 rounded">
          <option value="">-- Select Category --</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        {selectedCatObj?.subcategories?.length > 0 ? (
          <select value={subcategory} onChange={(e)=>setSubcategory(e.target.value)} className="border p-2 rounded">
            <option value="">-- Select Subcategory --</option>
            {selectedCatObj.subcategories.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        ) : (
          <input value={subcategory} onChange={(e)=>setSubcategory(e.target.value)} placeholder="Subcategory (optional)" className="border p-2 rounded" />
        )}

        <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files[0])} className="border p-2 rounded" />
      </div>

      <div className="mt-3">
        <button disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </div>
    </form>
  );
}
