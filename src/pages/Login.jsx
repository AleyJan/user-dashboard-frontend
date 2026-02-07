import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = "https://user-dashboard-backend-jade.vercel.app";

  useEffect(() => {
    // 1. Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });

    // 2. Check for success message from Register page
    if (location.state?.successMsg) {
      setSuccess(location.state.successMsg);
      // Clean up the state so message disappears on refresh
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Clear success message if user tries to log in again
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      // Handles the "msg" field from your backend
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50 px-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 mb-3">
            <FiCheckCircle className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-7 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          {/* Success Message Alert */}
          {success && (
            <div className="mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2 animate-pulse">
              <FiCheckCircle className="text-emerald-500" />
              {success}
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-widest">
                Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm font-medium"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-1.5 ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm font-medium"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Sign In{" "}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New here?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-indigo-600 font-bold hover:underline"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
