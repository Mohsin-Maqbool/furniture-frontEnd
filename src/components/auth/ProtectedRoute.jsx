// client/src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
}
