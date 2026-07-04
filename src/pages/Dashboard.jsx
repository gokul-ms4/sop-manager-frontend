import { Link } from "react-router-dom";
import {
  Bot,
  FileText,
  Layers,
  PlusCircle,
  Search,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1.5">{value}</h3>
      </div>
      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
        <Icon className="text-emerald-600" size={20} />
      </div>
    </div>
  );
}

function QuickAction({ title, description, to, icon: Icon }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-emerald-300 hover:shadow-md transition group"
    >
      <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition">
        <Icon className="text-white" size={20} />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}

// Reusable section card with a fixed-height scrollable body.
function ScrollSection({ title, linkLabel, linkTo, children, empty }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
        >
          {linkLabel}
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 max-h-56
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-slate-50
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-slate-200
        hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
        {empty ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-slate-400">{empty}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function SopItem({ sop }) {
  return (
    <Link
      to="/sop-management"
      className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition"
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition">
        <FileText size={14} className="text-slate-500 group-hover:text-emerald-600 transition" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-800 truncate">
          {sop.heading}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {sop.description || "No description"}
        </p>
      </div>

      {/* Item count badge */}
      {sop.sop_items?.length > 0 && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">
          {sop.sop_items.length} items
        </span>
      )}
    </Link>
  );
}

function QuestionItem({ item }) {
  const isQuick = item.mode !== "full";
  return (
    <Link
      to="/ask-ai"
      className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition"
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition">
        <MessageSquare size={14} className="text-slate-500 group-hover:text-emerald-600 transition" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-800 truncate">
          {item.text}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {isQuick ? "Quick Answer" : "Full SOP"}
        </p>
      </div>

      {/* Mode badge */}
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
          isQuick
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {isQuick ? (
          <span className="flex items-center gap-1">
            <Zap size={9} />
            Quick
          </span>
        ) : (
          "Full SOP"
        )}
      </span>
    </Link>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ headings: 0, items: 0, chunks: 0 });
  const [recentSops, setRecentSops] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get("/api/v1/sop_heading/dashboard_stats");
        setStats(statsRes.data.data);

        const sopRes = await api.get("/api/v1/sop_heading");
        const sops = sopRes.data.response.data || [];
        setRecentSops(sops);

        const storedQuestions = JSON.parse(
          localStorage.getItem("recent_questions") || "[]"
        );
        setRecentQuestions(storedQuestions);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err.response?.data || err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-5 overflow-y-auto pr-1">
      {/* Hero */}
      <div className="bg-slate-800 rounded-2xl p-7 text-white relative overflow-hidden shrink-0">
        <div className="absolute w-64 h-64 bg-emerald-600/20 rounded-full -right-16 -top-16" />
        <div className="absolute w-80 h-80 bg-emerald-500/10 rounded-full -left-20 -bottom-20" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            <Sparkles size={13} />
            AI Knowledge System
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            Manage SOPs, organize process knowledge, generate AI-ready chunks,
            and ask intelligent questions from your company knowledge base.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
        <DashboardCard title="SOP Headings" value={stats.headings} icon={FileText} />
        <DashboardCard title="SOP Items"    value={stats.items}    icon={Layers}   />
        <DashboardCard title="AI Chunks"    value={stats.chunks}   icon={Bot}      />
      </div>

      {/* Scrollable sections */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ScrollSection
          title="Recent SOPs"
          linkLabel="View all"
          linkTo="/sop-management"
          empty={recentSops.length === 0 ? "No SOPs yet." : null}
        >
          {recentSops.map((sop) => (
            <SopItem key={sop.id} sop={sop} />
          ))}
        </ScrollSection>

        <ScrollSection
          title="Recent AI Questions"
          linkLabel="Ask AI"
          linkTo="/ask-ai"
          empty={recentQuestions.length === 0 ? "No questions yet." : null}
        >
          {recentQuestions.map((item, i) => (
            <QuestionItem key={i} item={item} />
          ))}
        </ScrollSection>
      </div>

      {/* Quick actions */}
      <div className="shrink-0 pb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-4">
          <QuickAction
            title="Create New SOP"
            description="Add a new SOP heading and organize related process steps."
            to="/sop-management"
            icon={PlusCircle}
          />
          <QuickAction
            title="Ask AI"
            description="Ask questions and get context-aware answers from your SOP knowledge base."
            to="/ask-ai"
            icon={Search}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
