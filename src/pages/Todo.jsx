import axios from "axios";
import { useEffect, useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  const BASE_URL = "https://user-dashboard-backend-jade.vercel.app";

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch user info & todos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosRes = await axios.get(`${BASE_URL}/api/todos`, authHeader);
        setTodos(todosRes.data);

        const userRes = await axios.get(`${BASE_URL}/api/users/me`, authHeader);
        setUser(userRes.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch data");
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
      console.log(err);
      setError("Failed to add todo");
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
      console.log(err);
      setError("Failed to toggle todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/${id}`, authHeader);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
      setError("Failed to delete todo");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white flex flex-col md:flex-row justify-between items-center p-4 shadow gap-2 md:gap-0">
        <h1 className="text-xl font-bold">Todo App</h1>
        {user && <span className="md:mr-4">Welcome: {user.username}</span>}
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 active:bg-red-300"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Todo List - Left */}
        <ul className="flex-1 space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-lg font-medium">
              No todos added yet
            </div>
          ) : (
            todos.map((todo) => (
              <li
                key={todo._id}
                className="bg-white flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded shadow gap-2 sm:gap-0"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id)}
                    className="w-5 h-5"
                  />
                  <span
                    className={
                      todo.completed ? "line-through text-gray-400" : ""
                    }
                  >
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 active:bg-red-300 self-end sm:self-auto"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Add Todo - Right */}
        <div className="w-full md:w-80 mt-4 md:mt-0">
          <h2 className="text-lg font-semibold mb-4">Add New Todo</h2>
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Enter new todo"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <button
            onClick={addTodo}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Todo"}
          </button>
        </div>
      </main>
    </div>
  );
}
