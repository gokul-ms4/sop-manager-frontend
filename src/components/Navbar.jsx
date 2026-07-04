import { useEffect, useState } from "react";
import { LogOut, Menu } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick = () => {} }) {
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
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between gap-2 px-3 sm:px-6 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden -ml-1 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 shrink-0"
        >
          <Menu size={20} />
        </button>

        <span className="text-slate-800 font-bold text-sm sm:text-base tracking-tight truncate">
          AI SOP Assistant
        </span>

        {/* Pro badge — gradient pill instead of flat color */}
        <span className="hidden sm:inline-flex bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide shadow-sm shadow-emerald-200 shrink-0">
          PRO
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Profile block */}
        <div className="flex items-center gap-2 sm:gap-3 pl-1">
          {/* Avatar with gradient ring */}
          <div className="p-[2px] rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-200 shrink-0">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-600">
                {initial ?? "·"}
              </span>
            </div>
          </div>

          {/* Name + email — hidden on very small screens to save space */}
          <div className="leading-tight hidden sm:block max-w-[160px]">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {profile?.name || "Loading..."}
            </p>
            <p className="text-xs text-slate-400 truncate">{profile?.email || ""}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-100 mx-1" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition"
        >
          <LogOut
            size={15}
            className="transition group-hover:-translate-x-0.5"
          />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
