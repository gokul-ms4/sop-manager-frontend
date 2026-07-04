import { X } from "lucide-react";

function SopItemModal({ mode, itemForm, setItemForm, onClose, onSubmit }) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">
            {isEdit ? "Edit SOP Item" : "Add SOP Item"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-500">POSITION</label>
            <input
              value={itemForm.position}
              disabled
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500">TITLE</label>
            <input
              value={itemForm.title}
              onChange={(e) =>
                setItemForm({ ...itemForm, title: e.target.value })
              }
              placeholder="Manager Approval"
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500">CONTENT</label>
            <textarea
              value={itemForm.content}
              onChange={(e) =>
                setItemForm({ ...itemForm, content: e.target.value })
              }
              placeholder="Describe the SOP step..."
              rows="4"
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold">
            {isEdit ? "Update SOP Item" : "Create SOP Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SopItemModal;