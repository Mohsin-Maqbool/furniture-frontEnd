import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";

// ✅ Helper: fetch cart with token
const fetchCartWithToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch cart");
  }
  return res.json();
};

// ✅ Helper: create order
const createOrderWithToken = async (orderData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not logged in");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create order");
  }
  return res.json();
};

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState("COD");
  const navigate = useNavigate();

  // Load cart on mount
  useEffect(() => {
    fetchCartWithToken()
      .then(setCart)
      .catch((err) => toast.error(err.message));
  }, []);

  if (!cart) return <div className="p-6 text-center">⏳ Loading checkout...</div>;
  if (cart.items.length === 0) return <div className="p-6 text-center">🛒 Your cart is empty</div>;

  // ✅ Totals Calculation
  const subtotal = cart.items.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const tax = subtotal * 0.02;
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + tax + shipping;
  const totals = { subtotal, tax, shipping, total };

  const handlePlaceOrder = async () => {
    if (!address) return toast.error("Please select or add address");

    try {
      // Step 1 → create order
      const order = await createOrderWithToken({
        items: cart.items.map((i) => ({
          product: i.product._id || i.product,
          qty: i.qty,
        })),
        address,
        paymentMethod: payment,
        totals,
      });

      // ✅ COD only
      toast.success("✅ COD Order placed successfully!");
      localStorage.removeItem("cart");
      setCart({ items: [] });
      navigate("/orders");

      // ❌ Stripe flow removed
      /*
      if (payment !== "COD") {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              orderId: order._id,
              cartItems: cart.items,
              address,
            }),
          }
        );

        const data = await res.json();
        if (res.ok && data.url) {
          window.location.href = data.url;
        } else {
          toast.error(data.error || "Failed to start Stripe checkout");
        }
      }
      */
    } catch (err) {
      console.error("❌ Checkout failed:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="py-16 max-w-6xl w-full px-6 mx-auto grid md:grid-cols-2 gap-8">
      {/* LEFT: Address + Payment */}
      <div>
        <AddressForm onSelect={setAddress} />
        <PaymentMethod selected={payment} onChange={setPayment} />
      </div>

      {/* RIGHT: Order Summary */}
      <div className="bg-gray-100/40 p-6 border border-gray-300 rounded">
        <h2 className="text-xl font-medium mb-4">Order Summary</h2>
        <hr className="mb-4" />
        {cart.items.map((i) => (
          <div key={i.product._id} className="flex justify-between mb-2">
            <span>
              {i.product.name} × {i.qty}
            </span>
            <span>Rs. {i.product.price * i.qty}</span>
          </div>
        ))}
        <hr className="my-4" />
        <p className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>Rs. {totals.subtotal}</span>
        </p>
        <p className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{totals.shipping === 0 ? "Free" : `Rs. ${totals.shipping}`}</span>
        </p>
        <p className="flex justify-between text-gray-600">
          <span>Tax (2%)</span>
          <span>Rs. {totals.tax.toFixed(0)}</span>
        </p>
        <p className="flex justify-between text-lg font-semibold mt-3">
          <span>Total</span>
          <span>Rs. {totals.total.toFixed(0)}</span>
        </p>

        <button
          onClick={handlePlaceOrder}
          className="w-full py-3 mt-6 bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
