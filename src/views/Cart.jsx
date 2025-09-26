// client/src/views/Cart.jsx
import React, { useEffect, useState } from "react";
import {
  fetchCart,
  addToCart,
  decreaseCartItem,
  removeFromCart,
} from "@/utils/cartApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/imageHelper"; // ✅ central image handler

// ✅ Configurable constants
const DISCOUNT_THRESHOLD = 2000;
const DISCOUNT_RATE = 0.05;
const TAX_RATE = 0.02;
const SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 100;

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false); // ✅ spinner for updates
  const navigate = useNavigate();

  // ✅ Refresh cart from server
  const refreshCart = async () => {
    try {
      const data = await fetchCart();
      setCart(data);
      updateCountEvent(data);
    } catch (err) {
      console.error("❌ Cart load error:", err);
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // ✅ Update cart count in Navbar
  const updateCountEvent = (updated) => {
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { count: updated.items.reduce((sum, x) => sum + x.qty, 0) },
      })
    );
  };

  // --- Optimistic Updates ---
  const handleDecrease = async (id) => {
    const updated = {
      ...cart,
      items: cart.items.map((i) =>
        i.product._id === id ? { ...i, qty: Math.max(i.qty - 1, 1) } : i
      ),
    };
    setCart(updated);
    updateCountEvent(updated);
    try {
      setLoadingAction(true);
      await decreaseCartItem(id);
    } catch (err) {
      console.error("❌ Failed to decrease:", err);
      toast.error("Failed to update quantity");
      refreshCart();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleIncrease = async (id) => {
    const updated = {
      ...cart,
      items: cart.items.map((i) =>
        i.product._id === id ? { ...i, qty: i.qty + 1 } : i
      ),
    };
    setCart(updated);
    updateCountEvent(updated);
    try {
      setLoadingAction(true);
      await addToCart(id, 1);
    } catch (err) {
      console.error("❌ Failed to increase:", err);
      toast.error("Failed to update quantity");
      refreshCart();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemove = async (id, name) => {
    const updated = {
      ...cart,
      items: cart.items.filter((i) => i.product._id !== id),
    };
    setCart(updated);
    updateCountEvent(updated);
    toast.success(`${name} removed from cart`);
    try {
      setLoadingAction(true);
      await removeFromCart(id);
    } catch (err) {
      console.error("❌ Failed to remove:", err);
      toast.error("Failed to remove item");
      refreshCart();
    } finally {
      setLoadingAction(false);
    }
  };

  if (!cart) return <div className="p-6 text-center">⏳ Loading cart...</div>;
  if (cart.items.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">🛒 Your cart is empty.</div>
    );

  // ✅ Totals
  const subtotal = cart.items.reduce(
    (sum, i) => sum + i.qty * i.product.price,
    0
  );
  const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + tax + shipping;

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      {/* CART ITEMS */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">
            {cart.items.length} Items
          </span>
        </h1>

        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {/* Product Rows */}
        {cart.items.map((i) => (
          <div
            key={i.product._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium pt-3 border-b border-gray-200 pb-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                <img
                  className="max-w-full h-full object-cover"
                  src={getImageUrl(i.product.image)}
                  alt={i.product.title || i.product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">
                  {i.product.title || i.product.name}
                </p>
                <div className="font-normal text-gray-500/70">
                  <p>Category: {i.product.category?.name || "N/A"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleDecrease(i.product._id)}
                      disabled={loadingAction}
                      className="px-2 border rounded"
                    >
                      -
                    </button>
                    <span>{i.qty}</span>
                    <button
                      onClick={() => handleIncrease(i.product._id)}
                      disabled={loadingAction}
                      className="px-2 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              Rs. {i.product.price} × {i.qty} ={" "}
              <span className="font-semibold">
                Rs. {i.product.price * i.qty}
              </span>
            </p>
            <button
              onClick={() =>
                handleRemove(i.product._id, i.product.title || i.product.name)
              }
              disabled={loadingAction}
              className="cursor-pointer mx-auto text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
        >
          ⬅ Continue Shopping
        </button>
      </div>

      {/* ORDER SUMMARY */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">No address found</p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                <p
                  onClick={() => setShowAddress(false)}
                  className="text-gray-500 p-2 hover:bg-gray-100"
                >
                  New York, USA
                </p>
                <p
                  onClick={() => setShowAddress(false)}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </p>
          {discount > 0 && (
            <p className="flex justify-between text-green-600">
              <span>Discount ({DISCOUNT_RATE * 100}%)</span>
              <span>- Rs. {discount.toFixed(0)}</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">
              {shipping === 0 ? "Free" : `Rs. ${shipping}`}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Tax ({TAX_RATE * 100}%)</span>
            <span>Rs. {tax.toFixed(0)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>Rs. {total.toFixed(0)}</span>
          </p>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          disabled={cart.items.length === 0 || loadingAction}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition rounded disabled:opacity-50"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
