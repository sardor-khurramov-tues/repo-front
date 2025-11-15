import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Modal from "@/components/Modal";
import { updateBook } from "@/services/api/DocumentService";

export default function BookUpdateModal({ open, onClose, document, onUpdated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: document?.title || "",
      isbn: document?.isbn || "",
      editionNumber: document?.editionNumber || "",
      docAbstract: document?.docAbstract || "",
    },
  });

  const onSubmit = async (values) => {
    const trimmed = {
      title: values.title.trim(),
      isbn: values.isbn.trim() || null,
      editionNumber: values.editionNumber || null,
      docAbstract: values.docAbstract.trim() || null,
    };

    try {
      await updateBook(document.id, trimmed);
      alert("Book updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update book.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Book Information">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
          <input id="title"
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 255, message: "Title cannot exceed 255 characters" },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium mb-1">ISBN (optional)</label>
          <input id="isbn"
            {...register("isbn", {
              pattern: {
                value: /^(978|979)-\d{1,5}-\d{2,7}-\d{1,6}-\d$/,
                message: "ISBN must match pattern: 978-1-23456-789-0",
              },
              minLength: { value: 17, message: "ISBN must be 17 characters long" },
              maxLength: { value: 17, message: "ISBN must be 17 characters long" },
            })}
            placeholder="978-1-23456-789-0"
            className="w-full border p-2 rounded"
          />
          {errors.isbn && <p className="text-red-600 text-sm mt-1">{errors.isbn.message}</p>}
        </div>

        {/* Edition Number */}
        <div>
          <label htmlFor="editionNumber" className="block text-sm font-medium mb-1">Edition Number (optional)</label>
          <input id="editionNumber"
            type="number"
            {...register("editionNumber", {
              valueAsNumber: true,
              validate: (v) =>
                v === undefined || v === null || v >= 0 || "Edition number must be non-negative",
            })}
            className="w-full border p-2 rounded"
          />
          {errors.editionNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.editionNumber.message}</p>
          )}
        </div>

        {/* Abstract */}
        <div>
          <label htmlFor="abstract" className="block text-sm font-medium mb-1">Abstract (optional)</label>
          <textarea id="abstract"
            {...register("docAbstract", {
              maxLength: { value: 5000, message: "Abstract cannot exceed 5000 characters" },
            })}
            rows="4"
            className="w-full border p-2 rounded"
          />
          {errors.docAbstract && (
            <p className="text-red-600 text-sm mt-1">{errors.docAbstract.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
}

BookUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  onUpdated: PropTypes.func.isRequired,
};
