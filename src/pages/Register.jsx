import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  name: "",
  email: "",
  phone_number: "",
  password: "",
  avatar: null,
});

const [showPassword, setShowPassword] = useState(false)
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
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone_number", form.phone_number);
    formData.append("password", form.password);

    if (form.avatar) {
      formData.append("avatar", form.avatar);   
    }

   await api.post("/api/v1/auth/register", formData);

const loginRes = await api.post("/api/v1/auth/login", {
  email: form.email,
  password: form.password,
});

localStorage.setItem(
  "access_token",
  loginRes.data.message.access_token
);

localStorage.setItem(
  "refresh_token",
  loginRes.data.message.refresh_token
);

navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.error || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
<div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
  <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

    {/* Left - Form */}
    <div className="p-8 md:p-10 flex flex-col justify-center">
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
          AI SOP ASSISTANT
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          Create account
        </h1>
        <p className="text-slate-400 text-sm">
          Start organizing your SOPs and AI-ready knowledge base.
        </p>
      </div>

      {error && (
        <div className="mb-3 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
    Username
  </label>
  <div className="flex items-center gap-3">
    
    {/* Avatar circle */}
    <label className="shrink-0 w-10 h-10 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-400 cursor-pointer flex items-center justify-center transition group overflow-hidden">
      {form.avatar ? (
        <img
          src={URL.createObjectURL(form.avatar)}
          className="w-full h-full object-cover"
          alt="avatar"
        />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
      <input
        type="file"
        name="avatar"
        accept="image/*"
        className="hidden"
        onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
      />
    </label>

    {/* Username input */}
    <input
      type="text"
      name="name"
      placeholder="your name"
      value={form.name}
      onChange={handleChange}
      className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
    />
  </div>
</div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            maxLength={15}
            placeholder="+91 XXXXXXXXXX"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
        </div>

        <div>
  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="••••••••"
      value={form.password}
      onChange={handleChange}
      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition"
    >
      {showPassword ? (
        // Eye-off icon
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </svg>
      ) : (
        // Eye icon
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
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2.5 rounded-lg font-semibold text-sm tracking-wide transition-all duration-150 shadow-sm disabled:opacity-60 mt-1"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>

    {/* Right - Panel */}
    <div className="hidden md:flex flex-col bg-slate-800 items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-emerald-600/20 rounded-full" />
      <div className="absolute bottom-[-60px] left-[-30px] w-80 h-80 bg-emerald-500/10 rounded-full" />

      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
          AI · Ready
        </div>

        <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
  Document once.<br />
  <span className="text-emerald-400">Know forever.</span>
</h2>

        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
          Create SOPs, convert them into searchable chunks, and let AI answer from your structured knowledge base.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
  { label: "Create", value: "SOPs" },
  { label: "Generate", value: "Embeddings" },
  { label: "Ask", value: "AI" },

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

export default Register;