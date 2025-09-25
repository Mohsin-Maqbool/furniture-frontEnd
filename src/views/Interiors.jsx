import React, { useEffect, useState } from "react";
import API from "@/utils/api";
import { addToCart } from "@/utils/cartApi";
import { toast } from "react-hot-toast";
import { getImageUrl } from "@/utils/imageHelper";

export default function InteriorsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // --- FETCH CATEGORIES & SUBCATEGORIES ---
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
      console.error("Failed to fetch categories", err);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // --- FETCH PRODUCTS ---
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await API.get("/products"); // fetch all interiors
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const updatedCart = await addToCart(productId, 1);
      toast.success("Product added to cart!");
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: updatedCart.items.reduce((sum, i) => sum + i.qty, 0) },
        })
      );
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error("Failed to add to cart");
    }
  };

  // --- FRONTEND FILTERING ---
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory ? p.category?._id === selectedCategory : true;
    const matchSub = selectedSubcategory ? p.subcategory?._id === selectedSubcategory : true;
    return matchCategory && matchSub;
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12">
          🛋️ Interiors Shop
        </h1>

        {/* CATEGORY & SUBCATEGORY FILTERS */}
        {loadingCategories ? (
          <div className="text-center py-4">⏳ Loading categories...</div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-end mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory(""); // reset subcategory when category changes
              }}
              className="border p-2 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {selectedCategory && subs[selectedCategory]?.length > 0 && (
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">All Subcategories</option>
                {subs[selectedCategory].map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* PRODUCTS GRID */}
        {loadingProducts ? (
          <div className="text-center py-10">⏳ Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No interiors found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod._id}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    src={getImageUrl(prod.image)}
                    alt={prod.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  {prod.bestSeller && (
                    <span className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* PRODUCT INFO */}
                <div className="p-5 flex flex-col">
                  {/* CATEGORY > SUBCATEGORY */}
                  <p className="text-xs text-gray-400 mb-1">
                    {categories.find((c) => c._id === prod.category?._id)?.name}
                    {prod.subcategory
                      ? ` > ${subs[prod.category?._id]?.find((s) => s._id === prod.subcategory?._id)?.name}`
                      : ""}
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition">
                    {prod.title}
                  </h3>

                  <p className="text-amber-700 font-semibold text-lg mt-1">
                    Rs. {prod.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                    {prod.description || "High quality interior product."}
                  </p>

                  {/* STOCK & STATUS */}
                  <div className="flex justify-between items-center mt-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        prod.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {prod.stock > 0 ? `${prod.stock} in stock` : "Out of stock"}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        prod.status === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {prod.status || "active"}
                    </span>
                  </div>

                  {/* ADD TO CART BUTTON */}
                  <button
                    onClick={() => handleAddToCart(prod._id)}
                    disabled={prod.stock <= 0}
                    className={`mt-4 w-full py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                      prod.stock > 0
                        ? "bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    🛒 {prod.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
