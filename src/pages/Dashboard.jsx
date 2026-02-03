import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "https://user-dashboard-backend-jade.vercel.app"; // ✅ deployed backend

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">
              Registered Users
            </h2>
            <p className="text-sm text-gray-500">
              List of all users in the system
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Created At</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && !error && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-red-600">{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
