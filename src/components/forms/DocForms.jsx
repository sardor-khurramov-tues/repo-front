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

export default function DocForm({ docType }) {
  const [departments, setDepartments] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [docRole, setDocRole] = useState(DOC_ROLES.AUTHOR);
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
  };

  const handleRemoveContributor = (appUserId) => {
    setAddedContributors(addedContributors.filter((c) => c.appUserId !== appUserId));
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

    // Include type-specific fields
    if (form.isbn) payload.isbn = form.isbn;
    if (form.degreeType) payload.degreeType = form.degreeType;
    if (form.editionNumber) payload.editionNumber = Number(form.editionNumber);
    if (form.firstPage) payload.firstPage = Number(form.firstPage);
    if (form.lastPage) payload.lastPage = Number(form.lastPage);
    if (form.proceedSubj) payload.proceedSubj = form.proceedSubj;

    try {
      await submitMap[docType](payload);
      alert("Document submitted successfully");
      setForm({});
      setSelectedContributor(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Department</label>
        <select
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Title</label>
        <input name="title" value={form.title || ""} onChange={handleChange} />
      </div>

      {/* Conditional fields */}
      {(docType === "DISSERTATION" || docType === "BOOK" || docType === "REPORT" || docType === "CONFERENCE_PROCEEDINGS") && (
        <div>
          <label>ISBN</label>
          <input name="isbn" value={form.isbn || ""} onChange={handleChange} />
        </div>
      )}

      {docType === "DISSERTATION" && (
        <>
          <label>Degree Type</label>
          <input
            name="degreeType"
            value={form.degreeType || ""}
            onChange={handleChange}
          />
        </>
      )}

      {(docType === "BOOK" || docType === "REPORT") && (
        <div>
          <label>Edition Number</label>
          <input
            type="number"
            name="editionNumber"
            value={form.editionNumber || ""}
            onChange={handleChange}
          />
        </div>
      )}

      {(docType === "BOOK_CHAPTER" || docType === "CONFERENCE_PAPER") && (
        <>
          <label>First Page</label>
          <input
            type="number"
            name="firstPage"
            value={form.firstPage || ""}
            onChange={handleChange}
          />
          <label>Last Page</label>
          <input
            type="number"
            name="lastPage"
            value={form.lastPage || ""}
            onChange={handleChange}
          />
        </>
      )}

      {docType === "CONFERENCE_PROCEEDINGS" && (
        <div>
          <label>Proceeding Subject</label>
          <input
            name="proceedSubj"
            value={form.proceedSubj || ""}
            onChange={handleChange}
          />
        </div>
      )}

      <div>
        <label>Abstract</label>
        <textarea
          name="docAbstract"
          value={form.docAbstract || ""}
          onChange={handleChange}
        />
      </div>

      {/* Contributor Management */}
      <div>
        <h4>Add Contributors</h4>

        <input
          placeholder="Search contributor"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          Search
        </button>

        <ContributorSelector
          contributors={contributors}
          selected={selectedContributor}
          onSelect={setSelectedContributor}
        />

        <label>Role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {Object.values(DOC_ROLES).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleAddContributor}>
          Add Contributor
        </button>

        {addedContributors.length > 0 && (
          <div>
            <h5>Added Contributors:</h5>
            <ul>
              {addedContributors.map((c) => (
                <li key={c.appUserId}>
                  {c.name} - {c.docRole}{" "}
                  <button
                    type="button"
                    onClick={() => handleRemoveContributor(c.appUserId)}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button type="submit">Submit</button>
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
