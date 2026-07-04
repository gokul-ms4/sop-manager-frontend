import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

function SortableItem({ item, reorderMode, onEditItem, onDeleteItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    // Disabling when not in reorder mode stops dnd-kit's sensors from
    // ever starting a drag on this item, regardless of where it's clicked.
    disabled: !reorderMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // The actual dragged item is rendered in the DragOverlay (see
    // SopDetails), so fade the original out in place instead of letting
    // it "shadow-lg" jump around — gives a much cleaner motion.
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-4 p-4 rounded-xl border bg-slate-50 transition-colors ${
        isDragging
          ? "border-emerald-300"
          : "border-slate-100 hover:bg-emerald-50/40"
      }`}
    >
      <div
        // Only attach drag listeners/attributes while reorder mode is on.
        // Combined with `disabled` above, this is a belt-and-suspenders
        // guarantee that nothing drags outside reorder mode.
        {...(reorderMode ? attributes : {})}
        {...(reorderMode ? listeners : {})}
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 select-none ${
          reorderMode
            ? "bg-emerald-600 text-white cursor-grab active:cursor-grabbing touch-none"
            : "bg-slate-800 text-white"
        }`}
      >
        {reorderMode ? <GripVertical size={16} /> : item.position}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
        <p className="text-slate-500 text-sm mt-1">{item.content}</p>
      </div>

      {!reorderMode && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={() => onEditItem(item)}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 flex items-center justify-center"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteItem(item)}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-red-300 hover:text-red-600 flex items-center justify-center"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default SortableItem;
