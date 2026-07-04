import { GripVertical } from "lucide-react";

// A plain, non-sortable visual used only inside <DragOverlay>. It doesn't
// need useSortable at all — the overlay just needs to look right while it
// floats above the list and follows the pointer.
function SortableItemOverlay({ item }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-300 bg-white shadow-xl cursor-grabbing">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 bg-emerald-600 text-white">
        <GripVertical size={16} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
        <p className="text-slate-500 text-sm mt-1">{item.content}</p>
      </div>
    </div>
  );
}

export default SortableItemOverlay;
