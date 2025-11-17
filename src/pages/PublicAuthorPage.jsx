import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicAuthorByKey } from "../services/api/PublicService";

export default function PublicAuthorPage() {
  const { key } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Assuming the API returns the payload directly upon success.
        const response = await getPublicAuthorByKey(key);
        // Check if the payload exists in the response structure
        setAuthor(response.payload || response);
      } catch (error) {
        console.error("Failed to fetch author data:", error);
        setAuthor(null); // Explicitly set to null on error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [key]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-700">Loading author details...</div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-red-600">Author not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-10">

        {/* Author Header */}
        <header className="pb-4 mb-6 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {author.firstName} {author.lastName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Author Details</p>
        </header>

        {/* Additional Details (Using optional chaining for robustness) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-8">
          {author.hemisId && (
            <div>
              <strong className="font-semibold">HEMIS ID:</strong> {author.hemisId}
            </div>
          )}
          {author.orcid && (
            <div>
              <strong className="font-semibold">ORCID:</strong> {author.orcid}
            </div>
          )}
          {author.userKey && (
            <div className="md:col-span-2 text-sm text-gray-500">
              <strong className="font-semibold">User Key:</strong> {author.userKey}
            </div>
          )}
        </div>

        ---

        {/* Documents/Contributions Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            📚 Contributions
          </h2>

          {author.contributionList && author.contributionList.length > 0 ? (
            <ul className="space-y-3">
              {author.contributionList.map((c) => (
                <li
                  key={c.document.docKey}
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <Link
                    className="text-lg font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
                    to={`/document/${c.document.docKey}`}
                  >
                    {c.document.title}
                  </Link>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>
                      <strong className="font-medium text-gray-700">Role:</strong> {c.docRole}
                    </span>
                    <span>
                      <strong className="font-medium text-gray-700">Type:</strong> {c.document.docType}
                      {c.document.pubDate && ` • ${c.document.pubDate}`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No public contributions found for this author.</p>
          )}
        </section>
      </div>
    </div>
  );
}
