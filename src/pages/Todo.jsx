import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiLogOut,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiCircle,
  FiUser,
} from "react-icons/fi";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://user-dashboard-backend-jade.vercel.app";

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todosRes, userRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/todos`, authHeader),
          axios.get(`${BASE_URL}/api/users/me`, authHeader),
        ]);
        setTodos(todosRes.data);
        setUser(userRes.data);
      } catch (err) {
        setError("Session expired or server error");
      }
    };
    fetchData();
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/todos`,
        { title: text },
        authHeader,
      );
      setTodos([...todos, res.data]);
      setText("");
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/todos/${id}`,
        {},
        authHeader,
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError("Update failed");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/${id}`, authHeader);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError("Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FiCheckCircle className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 uppercase">
              TRACKER
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <FiUser />
                )}
                {user.username}
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-800">
              Create Task
            </h2>
            {error && (
              <div className="mb-4 text-xs font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
              />
              <button
                onClick={addTodo}
                disabled={loading || !text.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <FiPlus /> Add Task
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <p className="opacity-80 text-sm font-medium">Task Progress</p>
            <h3 className="text-3xl font-bold mt-1">
              {todos.filter((t) => t.completed).length} / {todos.length}
            </h3>
            <div className="w-full bg-indigo-700/50 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{
                  width: `${todos.length ? (todos.filter((t) => t.completed).length / todos.length) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Your Daily Tasks
            </h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
              {todos.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-slate-400">
                <FiCheckCircle size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">
                  All clear! Enjoy your day.
                </p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`group bg-white flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all ${todo.completed ? "bg-slate-50/50" : ""}`}
                >
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => toggleTodo(todo._id)}
                  >
                    <button
                      className={`text-2xl transition-colors ${todo.completed ? "text-indigo-500" : "text-slate-300"}`}
                    >
                      {todo.completed ? <FiCheckCircle /> : <FiCircle />}
                    </button>
                    <span
                      className={`font-medium transition-all ${todo.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
