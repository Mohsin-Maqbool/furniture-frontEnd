import React, { useEffect, useState } from "react";
import API from "@/utils/api";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await API.put(`/users/${id}`, { role });
      // update UI locally without refetch
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
    } catch (err) {
      alert("Failed to update role");
      console.error(err);
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">👥 Manage Users</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u._id.slice(-6)}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => removeUser(u._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
