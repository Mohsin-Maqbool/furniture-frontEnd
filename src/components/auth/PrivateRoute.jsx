import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🔔 tell Navbar to open login modal
    window.dispatchEvent(new CustomEvent("unauthorized"));
    return <Navigate to="/" replace />;
  }

  return children;
}
