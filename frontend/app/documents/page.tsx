"use client";

import DocumentPanel from "../components/DocumentPanel";
import API from "../../lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";

interface Document {
  id: number;
  filename: string;
  url: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await API.get("/documents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDocuments(response.data);
      } catch (err: any) {
        setError("Failed to fetch documents.");
      } finally {
        setLoading(false);
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
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-6xl text-white text-center font-bold mb-4">
        YOUR DOCUMENTS
      </h1>
      <Button onClick={() => router.push("/documents/upload")} className="mb-4">
        Upload Document
      </Button>
      {documents.length === 0 ? (
        <p className="text-white text-2xl text-center">
          {loading ? "Loading your files..." : "No files uploaded yet."}
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
