import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicDocumentByKey } from "../services/api/PublicService";

export default function PublicDocumentPage() {
  const { key } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await getPublicDocumentByKey(key);
        // Assuming the API returns the document object directly or within a 'payload' field
        setDoc(response.payload || response);
      } catch (error) {
        console.error("Failed to fetch document data:", error);
        setDoc(null); // Ensure state is null on fetch error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [key]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-700">Loading document details...</div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-red-600">Document not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-100">

        {/* Title and Metadata */}
        <header className="pb-6 mb-6 border-b border-indigo-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {doc.title}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-2">
            {doc.docType && (
              <span className="font-semibold text-indigo-600 uppercase tracking-wider">
                {doc.docType}
              </span>
            )}
            {doc.pubDate && (
              <span>
                Published: <span className="font-medium text-gray-700">{doc.pubDate}</span>
              </span>
            )}
            {/* Add other key fields here if available, e.g., DOI, Language */}
          </div>
        </header>

        ---

        {/* Abstract Section */}
        {doc.docAbstract && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              📝 Abstract
            </h2>
            <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-300 shadow-inner">
              {doc.docAbstract}
            </p>
          </section>
        )}

        ---

        {/* Contributors Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            👥 Contributors
          </h2>

          <div className="space-y-3">
            {doc.contributorSet && doc.contributorSet.length > 0 ? (
              doc.contributorSet.map((c) => (
                <div
                  key={c.appUser.userKey}
                  className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150"
                >
                  {/* Role on the left */}
                  <span className="text-sm font-medium text-gray-600 uppercase w-1/4">
                    {c.docRole}
                  </span>

                  {/* Author Link on the right */}
                  <Link
                    className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 transition duration-150 text-right w-3/4"
                    to={`/author/${c.appUser.userKey}`}
                  >
                    {c.appUser.firstName} {c.appUser.lastName}
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No public contributors listed for this document.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
