import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Modal from "@/components/Modal";
import { updateConfProceed } from "@/services/api/DocumentService";

export default function ConfProceedUpdateModal({ open, onClose, document, onUpdated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: document?.title || "",
      isbn: document?.isbn || "",
      proceedSubj: document?.proceedSubj || "",
      docAbstract: document?.docAbstract || "",
    },
  });

  const onSubmit = async (values) => {
    const trimmed = {
      title: values.title.trim(),
      isbn: values.isbn.trim() || null,
      proceedSubj: values.proceedSubj.trim() || null,
      docAbstract: values.docAbstract.trim() || null,
    };

    try {
      await updateConfProceed(document.id, trimmed);
      alert("Conference proceeding updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update proceeding.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Conference Proceeding">
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

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium mb-1">
            ISBN (optional)
          </label>
          <input
            id="isbn"
            {...register("isbn", {
              pattern: {
                value: /^(978|979)-\d{1,5}-\d{2,7}-\d{1,6}-\d$/,
                message: "ISBN must match pattern: 978-1-23456-789-0",
              },
              minLength: { value: 17, message: "Must be 17 characters" },
              maxLength: { value: 17, message: "Must be 17 characters" },
            })}
            placeholder="978-1-23456-789-0"
            className="w-full border p-2 rounded"
          />
          {errors.isbn && <p className="text-red-600 text-sm mt-1">{errors.isbn.message}</p>}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="proceedSubj" className="block text-sm font-medium mb-1">
            Subject (optional)
          </label>
          <input
            id="proceedSubj"
            {...register("proceedSubj", {
              maxLength: { value: 255, message: "Max 255 characters" },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.proceedSubj && (
            <p className="text-red-600 text-sm mt-1">{errors.proceedSubj.message}</p>
          )}
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

ConfProceedUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  onUpdated: PropTypes.func.isRequired,
};
