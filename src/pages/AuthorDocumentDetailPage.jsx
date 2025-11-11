import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getDocumentAsSubmitter,
    deleteDocumentAsSubmitter,
    removeContributorFromDocument,
    addContributorToDocument
} from '@/services/api/DocumentService';
import { searchPublicAuthor } from '@/services/api/PublicService';
import DocumentDetailView from '@/features/document/DocumentDetailView';

// Define the initial state for the contributor search
const initialAuthorSearchState = {
    key: '',
    results: [],
    loading: false,
    error: null,
};

export default function AuthorDocumentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isRemovingContributor, setIsRemovingContributor] = useState(false);
    
    // NEW: State for Contributor Search
    const [authorSearch, setAuthorSearch] = useState(initialAuthorSearchState);
    const [isAddingContributor, setIsAddingContributor] = useState(false); // NEW: State for adding

    // --- Data Fetching Function ---
    const fetchDocument = useCallback(async () => {
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
    }, [id]);

    // --- Data Fetching Effect ---
    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    // --- Author Search Handler (NEW) ---
    const handleSearchAuthor = useCallback(async (searchKey) => {
        if (!searchKey) {
            setAuthorSearch(initialAuthorSearchState);
            return;
        }

        setAuthorSearch(prev => ({ ...prev, loading: true, error: null, key: searchKey }));

        try {
            // Note: Using sensible defaults for limit and page
            const data = await searchPublicAuthor(searchKey, 10, 0); 
            setAuthorSearch(prev => ({ 
                ...prev, 
                results: data.clientList || [], 
                loading: false 
            }));
        } catch (err) {
            setAuthorSearch(prev => ({ 
                ...prev, 
                error: "Failed to search authors. Try again.", 
                loading: false 
            }));
            console.error("Search Author Error:", err);
        }
    }, []);

    // --- Contributor Addition Handler (NEW) ---
    const handleAddContributor = async (appUserId, docRole) => {
        if (!documentData) return;

        setIsAddingContributor(true);
        try {
            await addContributorToDocument(id, appUserId, docRole);
            alert("Contributor added successfully!");
            // Refresh document to show the new contributor
            await fetchDocument(); 
            // Reset search state
            setAuthorSearch(initialAuthorSearchState);
        } catch (err) {
            alert("Failed to add contributor. Please try again.");
            console.error("Add Contributor Error:", err);
        } finally {
            setIsAddingContributor(false);
        }
    };
    
    // --- Document Deletion Handler (EXISTING) ---
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteDocumentAsSubmitter(id);
            alert("Document deleted successfully!");
            navigate('/author/documents');
        } catch (err) {
            setDeleteError("Failed to delete the document.");
            console.error("Delete Document Error:", err);
            setIsDeleting(false);
        }
    };

    // --- Contributor Removal Handler (EXISTING) ---
    const handleRemoveContributor = async (contributorId) => {
        if (!window.confirm("Are you sure you want to remove this contributor from the document?")) {
            return;
        }

        setIsRemovingContributor(true);
        try {
            await removeContributorFromDocument(contributorId);
            alert("Contributor removed successfully!");
            await fetchDocument();
        } catch (err) {
            alert("Failed to remove contributor. Please try again.");
            console.error("Remove Contributor Error:", err);
        } finally {
            setIsRemovingContributor(false);
        }
    };

    // --- Loading, Error, Not Found States (EXISTING) ---
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

    if (error) {
        return (
            <div className="p-8 bg-red-100 border-l-4 border-red-500 text-red-700 min-h-screen">
                <p className="font-bold">Error loading document</p>
                <p>{error}</p>
            </div>
        );
    }

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
            handleRemoveContributor={handleRemoveContributor}
            isRemovingContributor={isRemovingContributor}
            
            // NEW PROPS
            authorSearch={authorSearch}
            handleSearchAuthor={handleSearchAuthor}
            handleAddContributor={handleAddContributor}
            isAddingContributor={isAddingContributor}
        />
    );
}
