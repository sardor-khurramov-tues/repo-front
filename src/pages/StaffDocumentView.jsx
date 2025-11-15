import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDocumentAsStaff,
  publishDocumentAsStaff,
  deleteDocumentAsStaff,
} from '@/services/api/DocumentService';

export default function StaffDocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocument = useCallback(async () => {
    if (!id) {
      setError('Document ID not provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const docData = await getDocumentAsStaff(id);
      setDocument(docData);
    } catch (err) {
      console.error('Failed to fetch document:', err);
      setError('Failed to load document details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const handlePublish = async () => {
    if (window.confirm('Are you sure you want to publish this document?')) {
      try {
        await publishDocumentAsStaff(id);
        alert('Document published successfully!');
        fetchDocument(); // Re-fetch to update status
      } catch (err) {
        alert('Failed to publish document.');
        console.error('Publish error:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await deleteDocumentAsStaff(id);
        alert('Document deleted successfully!');
        navigate('/staff-dashboard'); // Redirect to dashboard after deletion
      } catch (err) {
        alert('Failed to delete document.');
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) return <div className="p-4">Loading document...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!document) return <div className="p-4">Document not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
      <p className={`text-lg font-semibold mb-6 ${document.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
        Status: {document.isPublished ? 'Published' : 'Non-Published'}
      </p>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        {!document.isPublished && (
          <button
            onClick={handlePublish}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150"
          >
            Publish Document
          </button>
        )}
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150"
        >
          Delete Document
        </button>
      </div>

      <hr className="my-6" />

      {/* Document Details */}
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <div><span className="font-semibold">ID:</span> {document.id}</div>
        <div><span className="font-semibold">Key:</span> {document.docKey}</div>
        <div><span className="font-semibold">Type:</span> {document.docType}</div>
        <div><span className="font-semibold">Created At:</span> {new Date(document.createdAt).toLocaleDateString()}</div>
        {document.publishedAt && (
          <div><span className="font-semibold">Published At:</span> {new Date(document.publishedAt).toLocaleDateString()}</div>
        )}
        <div><span className="font-semibold">Submitter:</span> {document.submitter.firstName} {document.submitter.lastName} ({document.submitter.username})</div>
        <div><span className="font-semibold">Department:</span> {document.department.nameEn}</div>
      </div>

      <h2 className="text-2xl font-bold mt-6 mb-3">Abstract</h2>
      <p className="text-gray-800 border p-3 rounded-md bg-gray-50">{document.docAbstract || 'N/A'}</p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Contributors</h2>
      <ul className="list-disc ml-5">
        {document.contributorSet.map((contributor) => (
          <li key={contributor.id}>
            {contributor.appUser.firstName} {contributor.appUser.lastName} - **{contributor.docRole}**
          </li>
        ))}
      </ul>
    </div>
  );
}
