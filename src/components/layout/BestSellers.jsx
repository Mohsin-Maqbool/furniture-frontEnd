// client/src/components/layout/BestSellers.jsx
import React, { useEffect, useState } from "react";
import { addToCart } from "@/utils/cartApi";
import API from "@/utils/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/imageHelper";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products?sort=best-seller");
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        toast.error("Failed to load best sellers");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const updatedCart = await addToCart(productId, 1);
      toast.success("Product added to cart!");
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: {
            count: updatedCart.items.reduce((sum, i) => sum + i.qty, 0),
          },
        })
      );
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <div className="p-6 text-center">⏳ Loading best sellers...</div>;
  if (!products.length)
    return <div className="p-6 text-center text-gray-500">No best sellers available.</div>;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12">
          ✨ Best Sellers ✨
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((prod) => (   // 👈 only show first 4
            <div
              key={prod._id}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={getImageUrl(prod.image)}
                  alt={prod.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                  Bestseller
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition">
                  {prod.title}
                </h3>
                <p className="text-amber-700 font-semibold text-lg mt-1">
                  Rs. {prod.price}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                  {prod.description || "High quality product loved by our customers."}
                </p>

                {/* Stock + Status */}
                <div className="flex justify-between items-center mt-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${prod.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {prod.stock > 0 ? `${prod.stock} in stock` : "Out of stock"}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${prod.status === "active"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {prod.status || "active"}
                  </span>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(prod._id)}
                  disabled={prod.stock <= 0}
                  className={`mt-4 w-full py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ${prod.stock > 0
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


        {/* See More Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/shop")}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg"
          >
            See More →
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
