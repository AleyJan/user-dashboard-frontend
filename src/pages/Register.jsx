import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiUserPlus,
  FiCheckCircle,
  FiArrowRight,
  FiCamera,
} from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "https://user-dashboard-backend-jade.vercel.app";
  // const BASE_URL =
  //   window.location.hostname === "localhost"
  //     ? "http://localhost:5000"
  //     : "https://user-dashboard-backend-jade.vercel.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Profile picture required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("image", image);

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, formData);
      navigate("/login", {
        state: { successMsg: "Account created successfully!" },
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4 py-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3 ml-1">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 mb-3">
            <FiCheckCircle className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Create Account
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Track Your Life
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[1.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
          {error && (
            <div className="mb-3 text-[11px] font-bold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 flex items-center gap-2">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-2.5">
            <div className="flex flex-col items-center mb-1">
              <div className="relative group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiCamera className="text-slate-300 text-lg" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 p-1 rounded-full text-white shadow-sm">
                  <FiCamera size={10} />
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                Profile Photo
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-0.5 ml-1 uppercase tracking-widest">
                Username
              </label>
              <div className="relative group">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="james"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm font-medium"
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-0.5 ml-1 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm font-medium"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[9px] font-bold text-slate-500 mb-0.5 ml-1 uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-transparent rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm font-medium"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Get Started <FiArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
