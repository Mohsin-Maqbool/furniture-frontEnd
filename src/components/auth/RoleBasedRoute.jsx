import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    window.dispatchEvent(new CustomEvent("unauthorized"));
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
