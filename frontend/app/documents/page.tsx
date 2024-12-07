"use client";

import DocumentPanel from "../components/DocumentPanel";
import API from "../../lib/api";
import { useEffect, useState } from "react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await API.get("/documents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDocuments(response.data);
      } catch (err: any) {
        setError("Failed to fetch documents.");
      }
    };

    fetchDocuments();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-6xl text-white text-center font-bold mb-4">
        YOUR DOCUMENTS
      </h1>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {documents.map((doc: any) => (
            <DocumentPanel
              key={doc.id}
              id={doc.id}
              filename={doc.filename}
              url={doc.url}
              createdAt={doc.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
