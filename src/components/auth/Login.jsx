import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/utils/api";

export default function Login({ onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

      // ✅ Store auth info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/AdminDashboard");
      } else {
        navigate("/");
      }

      onClose?.();
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full sm:max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Welcome Back 👋</h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        Enter your credentials to access your account
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium text-white shadow-md transition ${
            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Signup
        </button>
      </p>
    </div>
  );
}
