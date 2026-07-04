import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import ConfirmModal from "../components/sop/ConfirmModal";
import HeadingList from "../components/sop/HeadingList";
import SopDetails from "../components/sop/SopDetails";
import SopItemModal from "../components/sop/SopItemModal";
import HeadingModal from "../components/sop/HeadingModal";

function SopHeadings() {
  const [search, setSearch] = useState("");
  const [deleteItemTarget, setDeleteItemTarget] = useState(null);
  const [itemMode, setItemMode] = useState("create");
  const [headings, setHeadings] = useState([]);
  const [selectedHeading, setSelectedHeading] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showHeadingModal, setShowHeadingModal] = useState(false);
  const [headingMode, setHeadingMode] = useState("create");

  const [showItemModal, setShowItemModal] = useState(false);

  const [headingForm, setHeadingForm] = useState({
    heading: "",
    description: "",
  });

  const [itemForm, setItemForm] = useState({
    id: null,
    title: "",
    content: "",
    position: "",
  });

  const getErrorMessage = (err, fallback) => {
    return (
      err.response?.data?.error ||
      err.response?.data?.message ||
      fallback
    );
  };

  // On desktop both panels are visible side by side, so auto-selecting the
  // first heading is a nice convenience — you land on something useful
  // immediately. On mobile, though, the list and detail panel take turns
  // filling the screen, so auto-selecting would skip straight past the
  // list and land on the detail view with no way back in. `lg` is
  // Tailwind's 1024px breakpoint — keep this in sync with the
  // `lg:grid-cols-[300px_1fr]` layout below.
  const isDesktopViewport = () =>
    typeof window !== "undefined" && window.innerWidth >= 1024;

  const fetchHeadings = async (selectedId = null) => {
    try {
      setLoading(true);

      const res = await api.get("/api/v1/sop_heading", {
        params: { search },
      });

      const data = res.data.response.data || [];
      setHeadings(data);

      if (selectedId) {
        const updated = data.find((item) => item.id === selectedId);
        setSelectedHeading(updated || null);
      } else if (data.length > 0 && !selectedHeading && isDesktopViewport()) {
        setSelectedHeading(data[0]);
      } else if (data.length === 0) {
        setSelectedHeading(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch SOP headings"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHeadings();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const openCreateHeadingModal = () => {
    setHeadingMode("create");
    setHeadingForm({
      heading: "",
      description: "",
    });
    setShowHeadingModal(true);
  };

  const openEditHeadingModal = (heading) => {
    setHeadingMode("edit");
    setSelectedHeading(heading);
    setHeadingForm({
      heading: heading.heading,
      description: heading.description,
    });
    setShowHeadingModal(true);
  };

  const submitHeading = async (e) => {
    e.preventDefault();

    if (!headingForm.heading.trim()) {
      toast.error("Heading is required");
      return;
    }

    try {
      if (headingMode === "create") {
        await api.post("/api/v1/sop_heading", headingForm);
        toast.success("SOP heading created successfully");
        await fetchHeadings();
      } else {
        await api.patch(
          `/api/v1/sop_heading/${selectedHeading.id}`,
          headingForm
        );
        toast.success("SOP heading updated successfully");
        await fetchHeadings(selectedHeading.id);
      }

      setShowHeadingModal(false);
      setHeadingForm({
        heading: "",
        description: "",
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save SOP heading"));
      console.error(err);
    }
  };

  const confirmDeleteHeading = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/api/v1/sop_heading/${deleteTarget.id}`);

      toast.success("SOP heading deleted successfully");

      setDeleteTarget(null);
      setSelectedHeading(null);

      await fetchHeadings();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete SOP heading"));
      console.error(err);
    }
  };

  const openItemModal = async () => {
    if (!selectedHeading) return;

    try {
      const res = await api.get(
        `/api/v1/sop_heading/${selectedHeading.id}/position`
      );

      setItemMode("create");

      setItemForm({
        id: null,
        title: "",
        content: "",
        position: res.data.data,
      });

      setShowItemModal(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to get next position"));
      console.error(err);
    }
  };

  const openEditItemModal = (item) => {
    setItemMode("edit");

    setItemForm({
      id: item.id,
      title: item.title,
      content: item.content,
      position: item.position,
    });

    setShowItemModal(true);
  };

  const submitItem = async (e) => {
    e.preventDefault();

    if (!itemForm.title.trim()) {
      toast.error("Item title is required");
      return;
    }

    try {
      if (itemMode === "create") {
        await api.post(`/api/v1/sop_heading/${selectedHeading.id}/sop_item`, {
          title: itemForm.title,
          content: itemForm.content,
        });

        toast.success("SOP item created successfully");
      } else {
        await api.patch(
          `/api/v1/sop_heading/${selectedHeading.id}/sop_item/${itemForm.id}`,
          {
            title: itemForm.title,
            content: itemForm.content,
          }
        );

        toast.success("SOP item updated successfully");
      }

      setItemForm({
        id: null,
        title: "",
        content: "",
        position: "",
      });

      setShowItemModal(false);

      await fetchHeadings(selectedHeading.id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save SOP item"));
      console.error(err);
    }
  };

  const confirmDeleteItem = async () => {
    if (!deleteItemTarget || !selectedHeading) return;

    try {
      await api.delete(
        `/api/v1/sop_heading/${selectedHeading.id}/sop_item/${deleteItemTarget.id}`
      );

      toast.success("SOP item deleted successfully");

      setDeleteItemTarget(null);
      await fetchHeadings(selectedHeading.id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete SOP item"));
      console.error(err);
    }
  };

  const handleReorder = async (items, movedItemId) => {
    const movedIndex = items.findIndex((item) => item.id === movedItemId);

    let prevId = "";

    if (movedIndex > 0) {
      prevId = items[movedIndex - 1].id;
    }

    try {
      await api.post(
        `/api/v1/sop_heading/${selectedHeading.id}/sop_item/${movedItemId}/position`,
        null,
        {
          params: {
            prev_id: prevId,
          },
        }
      );

      toast.success("SOP item order updated");

      await fetchHeadings(selectedHeading.id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to reorder SOP item"));
      console.error(err);
    }
  };

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          title="Delete SOP Heading"
          message="Are you sure you want to delete"
          highlight={deleteTarget.heading}
          onConfirm={confirmDeleteHeading}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {deleteItemTarget && (
        <ConfirmModal
          title="Delete SOP Item"
          message="Are you sure you want to delete"
          highlight={deleteItemTarget.title}
          onConfirm={confirmDeleteItem}
          onCancel={() => setDeleteItemTarget(null)}
        />
      )}

      {showHeadingModal && (
        <HeadingModal
          mode={headingMode}
          headingForm={headingForm}
          setHeadingForm={setHeadingForm}
          onClose={() => setShowHeadingModal(false)}
          onSubmit={submitHeading}
        />
      )}

      {showItemModal && (
        <SopItemModal
          mode={itemMode}
          itemForm={itemForm}
          setItemForm={setItemForm}
          onClose={() => setShowItemModal(false)}
          onSubmit={submitItem}
        />
      )}

      {/*
        Mobile: single-column master-detail. The list and detail panel take
        turns filling the screen — picking a heading swaps to the detail
        view, and the back button in SopDetails swaps back.
        Desktop (lg+): both panels are shown side by side at all times,
        regardless of selection state.
      */}
      <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
        <div
          className={`h-full min-h-0 ${
            selectedHeading ? "hidden lg:flex lg:flex-col" : "flex flex-col"
          }`}
        >
          <HeadingList
            headings={headings}
            loading={loading}
            selectedHeading={selectedHeading}
            search={search}
            setSearch={setSearch}
            onCreateHeading={openCreateHeadingModal}
            onSelectHeading={setSelectedHeading}
          />
        </div>

        <div
          className={`h-full min-h-0 ${
            selectedHeading ? "flex flex-col" : "hidden lg:flex lg:flex-col"
          }`}
        >
          <SopDetails
            selectedHeading={selectedHeading}
            onBack={() => setSelectedHeading(null)}
            onDeleteHeading={(heading) =>
              setDeleteTarget({
                id: heading.id,
                heading: heading.heading,
              })
            }
            onAddItem={openItemModal}
            onEditHeading={openEditHeadingModal}
            onEditItem={openEditItemModal}
            onDeleteItem={(item) => setDeleteItemTarget(item)}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </>
  );
}

export default SopHeadings;