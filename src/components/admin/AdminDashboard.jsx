import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user"); // clear stored user info
    navigate("/"); // ✅ go to homepage
  };

  // Only keep menu links here, no <Route> 👇
  const menuItems = [
    { path: "/admin/AdminDashboard/CategoriesManagement", label: "📂 Manage Categories" },
    { path: "/admin/AdminDashboard/ProductsManagement", label: "🛋️ Manage Products" },
    { path: "/admin/AdminDashboard/OrdersManagement", label: "📦 Manage Orders" },
    { path: "/admin/AdminDashboard/UsersManagement", label: "👥 Manage Users" },
    { path: "/admin/AdminDashboard/TestimonialsManagement", label: "⭐ Manage Testimonials" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-64 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 flex flex-col justify-between transition-transform duration-300`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            {/* Close button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ❌
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)} // close sidebar on mobile
                className={`px-3 py-2 rounded-lg transition ${location.pathname === item.path
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-3">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600 text-2xl"
          >
            ☰
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            Welcome, Admin 👋
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm">
              {JSON.parse(localStorage.getItem("user"))?.email || "admin@domain.com"}
            </span>
            <img
              src={`https://ui-avatars.com/api/?name=${JSON.parse(localStorage.getItem("user"))?.name || "Admin"
                }&background=4F46E5&color=fff`}
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
          </div>

        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
