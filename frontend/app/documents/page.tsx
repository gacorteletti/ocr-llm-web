"use client";

import DocumentPanel from "../components/DocumentPanel";
import API from "../../lib/api";
import { useEffect, useState } from "react";

interface Document {
  id: number;
  filename: string;
  url: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
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

  const handleDelete = (id: number) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc.id !== id)
    );
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-6xl text-white text-center font-bold mb-4">
        YOUR DOCUMENTS
      </h1>
      {documents.length === 0 ? (
        <p className="text-white text-2xl text-center">
          No files uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {documents.map((doc: any) => (
            <DocumentPanel
              key={doc.id}
              id={doc.id}
              filename={doc.filename}
              url={doc.url}
              createdAt={doc.createdAt}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
