import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/v1/auth/login", form);

      localStorage.setItem(
  "access_token",
  res.data.message.access_token
);

localStorage.setItem(
  "refresh_token",
  res.data.message.refresh_token
);

navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
  <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
    
    {/* Left - Form */}
    <div className="p-10 md:p-14 flex flex-col justify-center">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          AI SOP ASSISTANT
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          Welcome back
        </h1>
        <p className="text-slate-400 text-sm">
          Sign in to manage your SOPs and AI assistant.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
        </div>

        <div>
  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="••••••••"
      value={form.password}
      onChange={handleChange}
      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition"
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  </div>
</div>

        <button
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-150 shadow-sm disabled:opacity-60 mt-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </div>

    {/* Right - Panel */}
<div className="hidden md:flex flex-col bg-slate-800 items-center justify-center p-12 relative overflow-hidden">
  {/* subtle background circles */}
  <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-emerald-600/20 rounded-full" />
  <div className="absolute bottom-[-60px] left-[-30px] w-80 h-80 bg-emerald-500/10 rounded-full" />

  <div className="relative z-10 text-center">
    {/* Icon replaced with a text badge */}
    <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
      AI · Powered
    </div>

    <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
  One place for<br />
  <span className="text-emerald-400">every process.</span>
</h2>
    <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
      Organize procedures, generate AI-ready knowledge chunks, and get instant answers — all in one place.
    </p>

    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
      {[
  { label: "Sign In", value: "Securely" },
  { label: "Access", value: "Your SOPs" },
  { label: "Get", value: "Answers" },


      ].map((item) => (
        <div key={item.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="text-emerald-400 font-bold text-sm">{item.value}</div>
          <div className="text-slate-500 text-xs mt-0.5">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
</div>

  </div>
</div>
  );
}

export default Login;