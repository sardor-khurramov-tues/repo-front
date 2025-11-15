import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  searchPublishedDocumentAsStaff,
  searchNonpublishedDocumentAsStaff,
} from '@/services/api/DocumentService';

const LIMIT = 12; // Items per page

// Component for a single list of documents with pagination
function DocumentList({ searchFunction, activeTab }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 0-indexed page number
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchKey, setSearchKey] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchFunction(searchKey, LIMIT, page);
      setDocuments(response.documentList);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (err) {
      console.error(`Failed to fetch ${activeTab} documents:`, err);
      setError(`Failed to load ${activeTab} documents.`);
    } finally {
      setLoading(false);
    }
  }, [searchFunction, searchKey, page, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page on new search
    setPage(0);
    fetchData();
  };

  const renderDocumentRow = (doc) => (
    <tr key={doc.id} className="border-b hover:bg-gray-50">
      <td className="px-6 py-4">{doc.id}</td>
      <td className="px-6 py-4 font-medium text-gray-900">{doc.title}</td>
      <td className="px-6 py-4">{doc.docType}</td>
      <td className="px-6 py-4">{new Date(doc.createdAt).toLocaleDateString()}</td>
      <td className="px-6 py-4 text-right">
        <Link
          to={`/staff/document/${doc.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  );

  return (
    <div className="mt-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
            <input
                type="text"
                placeholder="Search by key/title..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg flex-grow"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Search
            </button>
        </form>
      
      {loading && <p>Loading documents...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Created At</th>
                  <th scope="col" className="px-6 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody>
                {documents.map(renderDocumentRow)}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-700">
              Showing **{documents.length}** of **{totalCount}** documents
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="py-2 px-4 border rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="py-2 px-4 border rounded-lg bg-white">
                Page {page + 1} of {pageCount}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= pageCount - 1}
                className="py-2 px-4 border rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Main Dashboard Component
export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('published'); // 'published' or 'non-published'

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold mb-6">Staff Document Management</h1>
      <Link to="/user" className="text-blue-500 hover:underline mb-6 block">View User Data</Link>

      <hr className="my-6" />

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('published')}
          className={`py-2 px-4 text-lg font-medium ${
            activeTab === 'published'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Published Documents
        </button>
        <button
          onClick={() => setActiveTab('non-published')}
          className={`py-2 px-4 text-lg font-medium ${
            activeTab === 'non-published'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Non-Published Documents
        </button>
      </div>

      {/* Document List based on active tab */}
      {activeTab === 'published' && (
        <DocumentList
          searchFunction={searchPublishedDocumentAsStaff}
          activeTab="Published"
        />
      )}
      {activeTab === 'non-published' && (
        <DocumentList
          searchFunction={searchNonpublishedDocumentAsStaff}
          activeTab="Non-Published"
        />
      )}
    </div>
  );
}
