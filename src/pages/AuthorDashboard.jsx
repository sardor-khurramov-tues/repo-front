import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
// Import the delete function from the service file
import { searchDocumentAsSubmitter, deleteDocumentAsSubmitter } from "../services/api/DocumentService";
import { format } from "date-fns";

const LIMIT = 10; // Items per page

export default function AuthorDashboard() {
  // State for the text currently entered in the input field
  const [inputKey, setInputKey] = useState("");
  // State for the key that is actually used for API fetching
  const [searchKey, setSearchKey] = useState(""); 
  
  const [documents, setDocuments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState({ id: null, loading: false, error: null });

  // Function to fetch documents (Wrapped in useCallback for useEffect dependency)
  const fetchDocuments = useCallback(async (key, page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchDocumentAsSubmitter(key, LIMIT, page);
      setDocuments(data.documentList || []);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents. Please try again.");
      setDocuments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // 1. useEffect runs ONLY when searchKey changes (or on initial load)
  useEffect(() => {
    // When searchKey updates (via handleSubmit or initial load), fetch documents from page 0
    fetchDocuments(searchKey, 0);
  }, [searchKey, fetchDocuments]);
  
  // 2. Handle Search Button Click or Form Submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Only update searchKey if the input key is different from the current search key
    if (inputKey !== searchKey) {
        setSearchKey(inputKey); 
        setCurrentPage(0); // Always reset to the first page on a new search
    }
  };

  // 3. Handle Delete Button Click
  const handleDelete = async (documentId, documentTitle) => {
    if (!window.confirm(`Are you sure you want to delete the document: "${documentTitle}"?`)) {
      return;
    }

    setDeleteStatus({ id: documentId, loading: true, error: null });

    try {
      await deleteDocumentAsSubmitter(documentId);
      setDeleteStatus({ id: null, loading: false, error: null });
      
      // Successfully deleted. Re-fetch documents for the current page.
      // We must check if the current page is now empty and adjust.
      let pageToFetch = currentPage;

      // If the current page becomes empty after deletion and it's not the first page,
      // move to the previous page.
      if (documents.length === 1 && currentPage > 0) {
        pageToFetch = currentPage - 1;
      }
      
      // Re-fetch the data with the potentially new page index
      fetchDocuments(searchKey, pageToFetch);

    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteStatus({ id: documentId, loading: false, error: "Failed to delete document." });
      // Optionally re-fetch on error to ensure data consistency
      fetchDocuments(searchKey, currentPage);
    }
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(totalCount / LIMIT)) {
      fetchDocuments(searchKey, newPage); // Use the *official* searchKey
    }
  };

  const pageCount = Math.ceil(totalCount / LIMIT);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header and Links (omitted for brevity) */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          📜 Author Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Welcome! Manage your submissions and profile here.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            to="/user"
            className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg shadow-md transition duration-300 font-semibold text-sm"
          >
            View User Data
          </Link>
          <Link
            to="/author/document/submission"
            className="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-lg shadow-md transition duration-300 font-semibold text-sm flex items-center"
          >
            ➕ New Document Submission
          </Link>
        </div>
      </header>
      
      ---

      {/* Search Bar */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🔍 My Submitted Documents
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by title, docType, etc."
              value={inputKey} // Binds to inputKey (the temporary value)
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              &#x1F50D;
            </span>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 font-semibold flex-shrink-0"
          >
            Search
          </button>
        </form>
        {searchKey && (
          <p className="mt-2 text-sm text-gray-500">
            Current filter: **{searchKey}**
          </p>
        )}
      </section>
      
      ---

      {/* Delete Error Notification */}
      {deleteStatus.error && (
        <div className="text-center p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          **Error deleting document {deleteStatus.id}:** {deleteStatus.error}
        </div>
      )}

      {/* Document List */}
      <section className="bg-white p-4 rounded-lg shadow-xl">
        {loading && (
          <div className="text-center p-8 text-indigo-500 font-medium">Loading documents...</div>
        )}

        {error && (
          <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && documents.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            No documents found for your search.
          </div>
        )}

        {!loading && documents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.title}
                      {doc.subtitle && <p className="text-xs text-gray-500 mt-0.5">{doc.subtitle}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {doc.docType.replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.createdAt ? format(new Date(doc.createdAt), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doc.isPublished ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doc.isPublished ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/author/document/${doc.id}`}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        disabled={deleteStatus.loading && deleteStatus.id === doc.id}
                        className={`transition duration-150 ease-in-out ${
                            (deleteStatus.loading && deleteStatus.id === doc.id)
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900"
                        }`}
                      >
                        {(deleteStatus.loading && deleteStatus.id === doc.id) ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pagination */}
      {!loading && documents.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{currentPage * LIMIT + 1}</span> to{" "}
            <span className="font-medium">{Math.min((currentPage + 1) * LIMIT, totalCount)}</span> of{" "}
            <span className="font-medium">{totalCount}</span> results
          </p>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              &larr; Previous
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pageCount - 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage >= pageCount - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next &rarr;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
