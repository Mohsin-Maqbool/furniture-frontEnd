// // client/src/components/admin/AdminLogin.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "@/utils/api";

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("admin@site.com");
//   const [password, setPassword] = useState("123456");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await API.post("/auth/login", { email, password }); // POST /api/auth/login
//       const { token, user } = res.data;
//       if (!token || !user) throw new Error("Invalid response");
//       if (user.role !== "admin") {
//         setError("This account is not an admin");
//         setLoading(false);
//         return;
//       }
//       localStorage.setItem("token", token);
//       localStorage.setItem("isAdmin", "true");
//       navigate("/admin/AdminDashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Login failed");
//       // fallback local dev: allow hardcoded admin if backend down (optional)
//       if (!err.response && email === "admin@site.com" && password === "123456") {
//         localStorage.setItem("isAdmin", "true");
//         navigate("/admin/AdminDashboard");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
//         {error && <div className="bg-red-50 text-red-700 p-2 mb-4 rounded">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <label className="block">
//             <span className="text-sm text-gray-700">Email</span>
//             <input className="mt-1 block w-full border rounded px-3 py-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
//           </label>
//           <label className="block">
//             <span className="text-sm text-gray-700">Password</span>
//             <input className="mt-1 block w-full border rounded px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
//           </label>
//           <button className={`w-full py-2 rounded text-white ${loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`} disabled={loading}>
//             {loading ? "Signing in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
