import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/v1/sop_heading/profile");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err.response?.data || err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : null;

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <span className="text-slate-800 font-bold text-base tracking-tight">
          AI SOP Assistant
        </span>

        {/* Pro badge — gradient pill instead of flat color */}
        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide shadow-sm shadow-emerald-200">
          PRO
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Profile block */}
        <div className="flex items-center gap-3 pl-1">
          {/* Avatar with gradient ring */}
          <div className="p-[2px] rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-200">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-600">
                {initial ?? "·"}
              </span>
            </div>
          </div>

          {/* Name + email */}
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">
              {profile?.name || "Loading..."}
            </p>
            <p className="text-xs text-slate-400">{profile?.email || ""}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition"
        >
          <LogOut
            size={15}
            className="transition group-hover:-translate-x-0.5"
          />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;