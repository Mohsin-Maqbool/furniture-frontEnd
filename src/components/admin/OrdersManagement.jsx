import { useEffect, useState, useMemo } from "react";
import API from "@/utils/api";
import { toast } from "react-hot-toast";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    line1: "",
    city: "",
  });
  const [search, setSearch] = useState("");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders failed:", err.response?.data || err.message);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Start editing
  const startEdit = (order) => {
    setEditingOrder(order._id);
    setForm({
      customerName: order.customerName || order.address?.name || "",
      phone: order.address?.phone || "",
      line1: order.address?.line1 || "",
      city: order.address?.city || "",
    });
  };

  // Save edited order
  const saveEdit = async (id) => {
    try {
      const payload = {
        customerName: form.customerName,
        address: {
          name: form.customerName,
          phone: form.phone,
          line1: form.line1,
          city: form.city,
        },
      };
      const { data } = await API.put(`/orders/${id}`, payload);
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
      setEditingOrder(null);
      toast.success("Order updated successfully");
    } catch (err) {
      console.error("Edit order failed:", err.response?.data || err.message);
      toast.error("Failed to update order");
    }
  };

  // Delete single order
  const deleteOrder = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await API.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success("Order deleted");
    } catch (err) {
      console.error("Delete order failed:", err.response?.data || err.message);
      toast.error("Failed to delete order");
    }
  };

  // Delete all orders
  const deleteAllOrders = async () => {
    if (!confirm("Are you sure you want to delete ALL orders?")) return;
    try {
      await Promise.all(orders.map((o) => API.delete(`/orders/${o._id}`)));
      setOrders([]);
      toast.success("All orders deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete all orders");
    }
  };

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      const { data } = await API.put(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: data.status } : o))
      );
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      console.error("Update status failed:", err.response?.data || err.message);
      toast.error("Failed to update order status");
    }
  };

  // Filtered orders based on search
  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    return orders.filter(
      (o) =>
        (o.customerName || o.address?.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        (o.address?.city || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  if (loading) return <p className="p-6 text-center">⏳ Loading orders...</p>;
  if (!orders.length) return <p className="p-6 text-center text-gray-500">No orders found.</p>;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">📦 Manage Orders</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-full md:w-64"
          />
          <button
            onClick={deleteAllOrders}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete All Orders
          </button>
        </div>
      </div>

      <div className="grid gap-5">
        {filteredOrders.map((o) => {
          const total =
            o.products?.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0) || 0;

          return (
            <div
              key={o._id}
              className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-5 p-5 rounded-md border border-gray-300 text-gray-800 hover:shadow-md transition"
            >
              {/* Order Details */}
              <div className="flex flex-col gap-1">
                <p className="font-medium text-indigo-600">Order #{o._id}</p>
                <p className="text-sm text-gray-500">
                  {(o.products || []).map((i, idx) => (
                    <span key={idx}>
                      {i.product?.name} {i.qty > 1 && <span className="text-indigo-500">x{i.qty}</span>}
                      {idx < o.products.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>

              {/* Customer Info */}
              <div className="text-sm">
                {editingOrder === o._id ? (
                  <div className="space-y-2">
                    <input
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="Customer Name"
                      className="border px-2 py-1 w-full rounded"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Phone"
                      className="border px-2 py-1 w-full rounded"
                    />
                    <input
                      value={form.line1}
                      onChange={(e) => setForm({ ...form, line1: e.target.value })}
                      placeholder="Address Line"
                      className="border px-2 py-1 w-full rounded"
                    />
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="City"
                      className="border px-2 py-1 w-full rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(o._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingOrder(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{o.customerName || o.address?.name || "Unknown Customer"}</p>
                    {o.address?.phone && <p className="text-gray-500">📞 {o.address.phone}</p>}
                    <p className="text-gray-500">
                      {o.address ? `${o.address.line1}, ${o.address.city}` : "No Address"}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button onClick={() => startEdit(o)} className="text-indigo-600 hover:underline">
                        ✏️ Edit
                      </button>
                      <button onClick={() => deleteOrder(o._id)} className="text-red-600 hover:underline">
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Total Amount */}
              <p className="font-medium text-base my-auto text-black/70">Rs. {total}</p>

              {/* Status */}
              <div className="flex flex-col text-sm gap-2">
                <p>
                  <span className="font-medium">Status: </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      o.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : o.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : o.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : o.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </p>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
