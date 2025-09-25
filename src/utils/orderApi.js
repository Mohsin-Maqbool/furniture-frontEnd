// client/src/utils/orderApi.js
import axios from "axios";
import API from "./api";

const API_URL = "http://localhost:5173/api/orders"; // adjust if different

// ✅ fetch all orders for the logged-in user
export async function fetchOrders() {
  const res = await axios.get(API_URL, { withCredentials: true });
  return res.data;
}

// ✅ create a new order
export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token"); // or wherever you store JWT
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
