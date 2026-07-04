import { X } from "lucide-react";

function HeadingModal({
  mode,
  headingForm,
  setHeadingForm,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">
            {isEdit ? "Edit SOP Heading" : "Create SOP Heading"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-500">
              HEADING
            </label>
            <input
              name="heading"
              value={headingForm.heading}
              onChange={(e) =>
                setHeadingForm({
                  ...headingForm,
                  heading: e.target.value,
                })
              }
              placeholder="Employee Onboarding Process"
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              value={headingForm.description}
              onChange={(e) =>
                setHeadingForm({
                  ...headingForm,
                  description: e.target.value,
                })
              }
              placeholder="Short description about this SOP..."
              rows="4"
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition">
            {isEdit ? "Update Heading" : "Create Heading"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default HeadingModal;