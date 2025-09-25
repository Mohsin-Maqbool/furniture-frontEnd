import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to see your orders");
          setLoading(false);
          return;
        }

        // ✅ use /my-orders endpoint and send token
        const res = await fetch("http://localhost:4500/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("❌ Fetch orders error:", err);
        toast.error("Failed to fetch orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-center">⏳ Loading orders...</div>;
  if (orders.length === 0)
    return <div className="p-6 text-center text-gray-500">📭 No orders found</div>;

  return (
    <div className="py-16 max-w-4xl w-full px-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛍 My Orders</h1>

      <div className="space-y-6">
        {orders.map((o) => (
          <div key={o._id} className="border p-4 rounded bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Order #{o._id.slice(-6)}</p>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  o.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : o.status === "shipped"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {o.status}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Placed on {new Date(o.createdAt).toLocaleDateString()}
            </p>

            <ul className="mt-3 space-y-1 text-gray-700">
              {(o.items || []).map((i) => (
                <li key={i.product?._id}>
                  {i.product?.name} × {i.qty} = Rs.{" "}
                  {(i.product?.price || 0) * i.qty}
                </li>
              ))}
            </ul>

            <hr className="my-2" />
            <p className="font-medium">Total: Rs. {o.totals?.total || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
