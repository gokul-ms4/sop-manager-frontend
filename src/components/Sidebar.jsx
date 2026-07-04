import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquareText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",      to: "/dashboard",      icon: LayoutDashboard },
  { label: "SOP Management", to: "/sop-management", icon: ClipboardList },
  { label: "Ask AI",         to: "/ask-ai",         icon: MessageSquareText },
];

function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Backdrop — mobile only, shown while the drawer is open */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 h-full transition-all duration-300 shrink-0 w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:z-auto md:translate-x-0
          ${collapsed ? "md:w-[72px]" : "md:w-60"}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/10 ${collapsed ? "md:justify-center md:px-0" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight">SOP AI</span>
          )}

          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                title={collapsed ? label : ""}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group relative ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                } ${collapsed ? "md:justify-center" : ""}`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}

                {collapsed && (
                  <span className="hidden md:block absolute left-full ml-3 px-2 py-1 bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle — desktop only, mobile drawer has no collapsed state */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-[72px] w-6 h-6 bg-slate-700 hover:bg-emerald-600 border border-slate-600 rounded-full items-center justify-center text-white transition z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
