import { useState } from "react";
import { Plus, Trash2, ClipboardList, Pencil } from "lucide-react";

import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import SortableItemOverlay from "./SortableItemOverlay";

function SopDetails({
  selectedHeading,
  onDeleteHeading,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onEditHeading,
  onReorder,
}) {
  const [reorderMode, setReorderMode] = useState(false);
  const [activeId, setActiveId] = useState(null);

  // A small activation distance/delay means a normal click on the handle
  // (or anywhere else) won't be misread as the start of a drag — the
  // pointer has to actually move a few pixels first.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!selectedHeading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center p-8">
        <ClipboardList className="text-slate-300 mb-4" size={40} />
        <h3 className="text-base font-bold text-slate-700">
          Select an SOP heading
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Choose a heading from the left to view its SOP items.
        </p>
      </div>
    );
  }

  const items = selectedHeading.sop_items || [];
  const activeItem = items.find((item) => item.id === activeId);

  const handleDragStart = (event) => {
    if (!reorderMode) return;
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);

    if (!reorderMode) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    onReorder(reorderedItems, active.id);
  };

  const handleDragCancel = () => setActiveId(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              {selectedHeading.heading}
            </h2>

            <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              {items.length} items
            </span>
          </div>

          <p className="text-slate-400 text-sm mt-1">
            {selectedHeading.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEditHeading(selectedHeading)}
            className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDeleteHeading(selectedHeading)}
            className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            SOP Items
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReorderMode(!reorderMode)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                reorderMode
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {reorderMode ? "Done" : "Reorder Items"}
            </button>

            <button
              type="button"
              onClick={onAddItem}
              className="bg-slate-900 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-slate-500">
              No SOP items yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Click "Add Item" to get started.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    reorderMode={reorderMode}
                    onEditItem={onEditItem}
                    onDeleteItem={onDeleteItem}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
              {activeItem ? <SortableItemOverlay item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default SopDetails;
