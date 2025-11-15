import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Modal from "@/components/Modal";
import { updateDissertation } from "@/services/api/DocumentService";
import { DEGREE_TYPE_LIST } from "@/configs/constants";

export default function DissertationUpdateModal({ open, onClose, document, onUpdated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: document?.title || "",
      degreeType: document?.degreeType || "",
      isbn: document?.isbn || "",
      docAbstract: document?.docAbstract || "",
    },
  });

  const onSubmit = async (values) => {
    const trimmed = {
      title: values.title.trim(),
      degreeType: values.degreeType || null,
      isbn: values.isbn.trim() || null,
      docAbstract: values.docAbstract.trim() || null,
    };

    try {
      await updateDissertation(document.id, trimmed);
      alert("Dissertation updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update dissertation.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Dissertation Information">
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
              maxLength: { value: 255, message: "Title cannot exceed 255 characters" },
            })}
            className="w-full border p-2 rounded"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Degree Type */}
        <div>
          <label htmlFor="degreeType" className="block text-sm font-medium mb-1">
            Degree Type (optional)
          </label>
          <select
            id="degreeType"
            {...register("degreeType")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select degree type</option>
            {DEGREE_TYPE_LIST.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
              minLength: { value: 17, message: "ISBN must be 17 characters long" },
              maxLength: { value: 17, message: "ISBN must be 17 characters long" },
            })}
            placeholder="978-1-23456-789-0"
            className="w-full border p-2 rounded"
          />
          {errors.isbn && <p className="text-red-600 text-sm mt-1">{errors.isbn.message}</p>}
        </div>

        {/* Abstract */}
        <div>
          <label htmlFor="docAbstract" className="block text-sm font-medium mb-1">
            Abstract (optional)
          </label>
          <textarea
            id="docAbstract"
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
          className={`w-full text-white py-2 rounded ${
            isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
}

DissertationUpdateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  onUpdated: PropTypes.func.isRequired,
};
