// client/src/components/auth/Signup.jsx
import React, { useState } from "react";
import API from "@/utils/api";

export default function Signup({ onClose, onSwitchToLogin, currentUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // default
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = currentUser?.role === "admin"; // check if admin is creating user

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        // only allow role override if current user is admin
        role: isAdmin ? form.role : "user",
      });

      const { token, user } = res.data;

      // if admin creates user, no need to login as them
      if (!isAdmin) {
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", user.role);
      }

      onClose?.();

      if (!isAdmin) {
        if (user.role === "admin") {
          window.location.href = "/admin/AdminDashboard";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full sm:max-w-sm mx-auto animate-fadeIn">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        Create Account
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Role selector for admin only */}
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium shadow-sm hover:bg-indigo-700 transition duration-200 text-sm"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => {
            onClose?.();
            if (typeof onSwitchToLogin === "function") onSwitchToLogin();
          }}
          className="text-indigo-600 font-medium hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
}
