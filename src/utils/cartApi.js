// client/src/utils/cartApi.js
import API from "./api"; // central axios instance

// -------------------------
// Cart API Helpers
// -------------------------

// Fetch cart items for logged-in user
export const fetchCart = async () => {
  const { data } = await API.get("/cart");
  return data;
};

// Add or increase quantity of a product
export const addToCart = async (productId, qty = 1) => {
  const { data } = await API.post("/cart/add", { productId, qty });
  return data;
};

// Decrease quantity by 1
export const decreaseCartItem = async (productId) => {
  const { data } = await API.post("/cart/decrease", { productId });
  return data;
};

// Remove a product completely
export const removeFromCart = async (productId) => {
  const { data } = await API.delete(`/cart/${productId}`);
  return data;
};

// Update cart item quantity to a specific number
export const updateCartItem = async (productId, qty) => {
  const { data } = await API.put(`/cart/${productId}`, { qty });
  return data;
};

// -------------------------
// Cart Count Handling
// -------------------------
export let cartCount = 0;

/**
 * Fetch cart count (only if user logged in)
 * - If no token present, resolve to 0 (skip network call).
 */
export const fetchCartCount = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      cartCount = 0;
      return cartCount;
    }

    const cart = await fetchCart();
    cartCount = Array.isArray(cart?.items)
      ? cart.items.reduce((sum, item) => sum + (item.qty || 0), 0)
      : 0;
  } catch (err) {
    console.error("❌ Cart count fetch error:", err?.message || err);
    cartCount = 0;
  }
  return cartCount;
};

// Global listener for cart updates
window.addEventListener("cartUpdated", (e) => {
  cartCount = e.detail.count ?? cartCount;
});
