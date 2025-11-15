import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Modal from "@/components/Modal";
import { updateBookChapter } from "@/services/api/DocumentService";

export default function BookChapterUpdateModal({ open, onClose, document, onUpdated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: document?.title || "",
      firstPage: document?.firstPage || "",
      lastPage: document?.lastPage || "",
      docAbstract: document?.docAbstract || "",
    },
  });

  const onSubmit = async (values) => {
    const trimmed = {
      title: values.title.trim(),
      firstPage: values.firstPage ? Number(values.firstPage) : null,
      lastPage: values.lastPage ? Number(values.lastPage) : null,
      docAbstract: values.docAbstract.trim() || null,
    };

    try {
      await updateBookChapter(document.id, trimmed);
      alert("Book chapter updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update book chapter.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Book Chapter">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            id="title"
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 255, message: "Max 255 characters" },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* First Page */}
        <div>
          <label htmlFor="firstPage" className="block text-sm font-medium mb-1">
            First Page (optional)
          </label>
          <input
            id="firstPage"
            type="number"
            {...register("firstPage")}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Last Page */}
        <div>
          <label htmlFor="lastPage" className="block text-sm font-medium mb-1">
            Last Page (optional)
          </label>
          <input
            id="lastPage"
            type="number"
            {...register("lastPage")}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Abstract */}
        <div>
          <label htmlFor="docAbstract" className="block text-sm font-medium mb-1">
            Abstract (optional)
          </label>
          <textarea
            id="docAbstract"
            {...register("docAbstract", {
              maxLength: { value: 5000, message: "Max 5000 characters" },
            })}
            rows="4"
            className="w-full border p-2 rounded"
          />
          {errors.docAbstract && (
            <p className="text-red-600 text-sm mt-1">{errors.docAbstract.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
}

BookChapterUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  onUpdated: PropTypes.func.isRequired,
};
