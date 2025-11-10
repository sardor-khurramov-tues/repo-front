import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentAsSubmitter, deleteDocumentAsSubmitter } from '../services/api/DocumentService';
import DocumentDetailView from '../components/DocumentDetailView';

export default function AuthorDocumentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getDocumentAsSubmitter(id);
                setDocumentData(data);
            } catch (err) {
                setError("Failed to load document details. Please check the document ID.");
                console.error("Fetch Document Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    // --- Deletion Handler ---
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteDocumentAsSubmitter(id);
            alert("Document deleted successfully!");
            // Redirect user to the list of documents
            navigate('/author/documents');
        } catch (err) {
            setDeleteError("Failed to delete the document.");
            console.error("Delete Document Error:", err);
            setIsDeleting(false);
        }
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-indigo-600 flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading document...
                </div>
            </div>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="p-8 bg-red-100 border-l-4 border-red-500 text-red-700 min-h-screen">
                <p className="font-bold">Error loading document</p>
                <p>{error}</p>
            </div>
        );
    }

    // --- Not Found State ---
    if (!documentData) {
        return (
            <div className="p-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 min-h-screen">
                <p className="font-bold">Not Found</p>
                <p>No document found with ID: **{id}**.</p>
            </div>
        );
    }

    // --- Main Render ---
    return (
        <DocumentDetailView
            id={id}
            documentData={documentData}
            isDeleting={isDeleting}
            deleteError={deleteError}
            handleDelete={handleDelete}
        />
    );
}
