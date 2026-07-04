import { Plus, ClipboardList, Search } from "lucide-react";

function HeadingList({
  headings,
  loading,
  selectedHeading,
  search,
  setSearch,
  onCreateHeading,
  onSelectHeading,
}) {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800">SOP Management</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Create and manage SOP knowledge.
        </p>
      </div>

      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SOP..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <button
          type="button"
          onClick={onCreateHeading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition"
        >
          <Plus size={16} />
          Create SOP Heading
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : headings.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardList className="text-slate-200 mx-auto mb-2" size={32} />
            <p className="text-xs text-slate-400">No SOP headings found.</p>
          </div>
        ) : (
          headings.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectHeading(item)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selectedHeading?.id === item.id
                  ? "bg-emerald-50 border-emerald-200 shadow-sm"
                  : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`font-semibold text-sm truncate ${
                    selectedHeading?.id === item.id
                      ? "text-emerald-700"
                      : "text-slate-800"
                  }`}
                >
                  {item.heading}
                </p>

                <span
                  className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    selectedHeading?.id === item.id
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {item.sop_items?.length || 0}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {item.description}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default HeadingList;