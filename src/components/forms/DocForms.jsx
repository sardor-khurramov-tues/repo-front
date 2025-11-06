import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  getPublicDepartmentNonBlocked,
  searchPublicAuthor,
} from "../../services/api/PublicService";
import {
  submitDissertation,
  submitConferenceProceedings,
  submitConferencePaper,
  submitBook,
  submitBookChapter,
  submitReport,
} from "../../services/api/DocumentService";
import { DOC_ROLES } from "../../configs/constants";
import ContributorSelector from "../commons/ContributorSelector";

const submitMap = {
  DISSERTATION: submitDissertation,
  CONFERENCE_PROCEEDINGS: submitConferenceProceedings,
  CONFERENCE_PAPER: submitConferencePaper,
  BOOK: submitBook,
  BOOK_CHAPTER: submitBookChapter,
  REPORT: submitReport,
};

// Tailwind utility classes for consistency
const inputClass =
  "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm";
const labelClass =
  "block text-sm font-semibold text-gray-700 mt-4 mb-1 tracking-wide";
const primaryButtonClass =
  "px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out shadow-md";
const secondaryButtonClass =
  "px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none transition duration-150 ease-in-out";

export default function DocForm({ docType }) {
  const [departments, setDepartments] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [selectedRole, setSelectedRole] = useState(DOC_ROLES.AUTHOR);
  const [addedContributors, setAddedContributors] = useState([]);

  const [form, setForm] = useState({
    departmentId: "",
    title: "",
    isbn: "",
    degreeType: "",
    editionNumber: "",
    firstPage: "",
    lastPage: "",
    proceedSubj: "",
    docAbstract: "",
  });

  useEffect(() => {
    getPublicDepartmentNonBlocked().then(setDepartments);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const res = await searchPublicAuthor(searchKey, 12, 0);
    setContributors(res.clientList);
  };

  const handleAddContributor = () => {
    if (!selectedContributor) {
      alert("Select a contributor first");
      return;
    }

    const alreadyAdded = addedContributors.find(
      (c) => c.appUserId === selectedContributor.id
    );
    if (alreadyAdded) {
      alert("This contributor is already added");
      return;
    }

    const newContributor = {
      appUserId: selectedContributor.id,
      docRole: selectedRole,
      name: `${selectedContributor.firstName} ${selectedContributor.lastName}`,
    };

    setAddedContributors([...addedContributors, newContributor]);
    setSelectedContributor(null);
    setSearchKey("");
    setContributors([]);
  };

  const handleRemoveContributor = (appUserId) => {
    setAddedContributors(
      addedContributors.filter((c) => c.appUserId !== appUserId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      departmentId: Number(form.departmentId),
      title: form.title,
      docAbstract: form.docAbstract,
      docContributorList: addedContributors.map(({ appUserId, docRole }) => ({
        appUserId,
        docRole,
      })),
    };

    if (form.isbn) payload.isbn = form.isbn;
    if (form.degreeType) payload.degreeType = form.degreeType;
    if (form.editionNumber) payload.editionNumber = Number(form.editionNumber);
    if (form.firstPage) payload.firstPage = Number(form.firstPage);
    if (form.lastPage) payload.lastPage = Number(form.lastPage);
    if (form.proceedSubj) payload.proceedSubj = form.proceedSubj;

    try {
      await submitMap[docType](payload);
      alert("Document submitted successfully");
      setForm({
        departmentId: "",
        title: "",
        isbn: "",
        degreeType: "",
        editionNumber: "",
        firstPage: "",
        lastPage: "",
        proceedSubj: "",
        docAbstract: "",
      });
      setAddedContributors([]);
      setSelectedContributor(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl space-y-8 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3">
        Submit New Document:{" "}
        <span className="text-blue-600">
          {/* SonarQube fix: Use replaceAll for global replacements */}
          {docType.replaceAll("_", " ")}
        </span>
      </h2>

      {/* General Fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="departmentId" className={labelClass}>
            Department
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Enter document title"
          />
        </div>
      </div>

      {/* Conditional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(docType === "DISSERTATION" ||
          docType === "BOOK" ||
          docType === "REPORT" ||
          docType === "CONFERENCE_PROCEEDINGS") && (
            <div>
              <label htmlFor="isbn" className={labelClass}>
                ISBN
              </label>
              <input
                id="isbn"
                name="isbn"
                value={form.isbn || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter ISBN"
              />
            </div>
          )}

        {docType === "DISSERTATION" && (
          <div>
            <label htmlFor="degreeType" className={labelClass}>
              Degree Type
            </label>
            <input
              id="degreeType"
              name="degreeType"
              value={form.degreeType || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g., PhD, MSc"
            />
          </div>
        )}

        {(docType === "BOOK" || docType === "REPORT") && (
          <div>
            <label htmlFor="editionNumber" className={labelClass}>
              Edition Number
            </label>
            <input
              id="editionNumber"
              type="number"
              name="editionNumber"
              value={form.editionNumber || ""}
              onChange={handleChange}
              className={inputClass}
              min="1"
              placeholder="1"
            />
          </div>
        )}

        {(docType === "BOOK_CHAPTER" || docType === "CONFERENCE_PAPER") && (
          <>
            <div>
              <label htmlFor="firstPage" className={labelClass}>
                First Page
              </label>
              <input
                id="firstPage"
                type="number"
                name="firstPage"
                value={form.firstPage || ""}
                onChange={handleChange}
                className={inputClass}
                min="1"
              />
            </div>
            <div>
              <label htmlFor="lastPage" className={labelClass}>
                Last Page
              </label>
              <input
                id="lastPage"
                type="number"
                name="lastPage"
                value={form.lastPage || ""}
                onChange={handleChange}
                className={inputClass}
                min={form.firstPage ? Number(form.firstPage) : "1"}
              />
            </div>
          </>
        )}

        {docType === "CONFERENCE_PROCEEDINGS" && (
          <div>
            <label htmlFor="proceedSubj" className={labelClass}>
              Proceeding Subject
            </label>
            <input
              id="proceedSubj"
              name="proceedSubj"
              value={form.proceedSubj || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter subject"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="docAbstract" className={labelClass}>
          Abstract
        </label>
        <textarea
          id="docAbstract"
          name="docAbstract"
          value={form.docAbstract || ""}
          onChange={handleChange}
          required
          rows="4"
          className={`${inputClass} resize-none`}
          placeholder="Provide a brief abstract"
        />
      </div>

      {/* Contributor Section */}
      <div className="border p-6 rounded-xl bg-gray-50 shadow-inner space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Add Contributors
        </h4>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Fix S6853: Add label for the search input */}
          <label htmlFor="contributor-search" className="sr-only">
            Search contributor name
          </label>
          <input
            id="contributor-search"
            placeholder="Search contributor name"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className={`${inputClass} flex-grow`}
          />
          <button
            type="button"
            onClick={handleSearch}
            className={primaryButtonClass}
          >
            Search
          </button>
        </div>

        <div className="md:flex md:space-x-4 space-y-4 md:space-y-0 items-end">
          <div className="flex-grow">
            {/* S6853 Fix (already done in previous step) */}
            <label className={labelClass} htmlFor="contributor-selector-input">
              Select Contributor
            </label>
            <ContributorSelector
              contributors={contributors}
              selected={selectedContributor}
              onSelect={setSelectedContributor}
              className={inputClass}
              inputId="contributor-selector-input"
            />
          </div>

          <div>
            {/* Fix S6853: Add htmlFor to label and id to select */}
            <label htmlFor="contributor-role" className={labelClass}>Role</label>
            <select
              id="contributor-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={inputClass}
            >
              {Object.values(DOC_ROLES).map((r) => (
                <option key={r} value={r}>
                  {/* Fix S7781: Use replaceAll for global replacement */}
                  {r.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddContributor}
            className={`${primaryButtonClass} w-full md:w-auto mt-2 md:mt-0`}
          >
            Add Contributor
          </button>
        </div>

        {addedContributors.length > 0 && (
          <div className="mt-6">
            <h5 className="text-md font-semibold text-gray-700 border-t pt-4">
              Added Contributors
            </h5>
            <ul className="divide-y divide-gray-200">
              {addedContributors.map((c) => (
                <li
                  key={c.appUserId}
                  className="flex justify-between items-center py-2"
                >
                  <span className="text-gray-700">
                    <span className="font-medium">{c.name}</span>{" "}
                    <span className="text-gray-500 text-sm italic">
                      {/* Fix S7781: Use replaceAll for global replacement */}
                      ({c.docRole.replaceAll("_", " ")})
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveContributor(c.appUserId)}
                    className={secondaryButtonClass}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`${primaryButtonClass} w-full text-lg py-3 font-semibold`}
      >
        Submit Document
      </button>
    </form>
  );
}

DocForm.propTypes = {
  docType: PropTypes.oneOf([
    "DISSERTATION",
    "CONFERENCE_PROCEEDINGS",
    "CONFERENCE_PAPER",
    "BOOK",
    "BOOK_CHAPTER",
    "REPORT",
  ]).isRequired,
};
