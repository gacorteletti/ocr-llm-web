"use client";

import { useState, useEffect } from "react";
import API from "../../../../lib/api";
import { useParams } from "next/navigation";
import Button from "../../../components/Button";

interface Document {
  id: number;
  filename: string;
  extractedText: string;
}

export default function AnalyzePage() {
  const { id } = useParams(); // fetch doc ID from URL path
  const [document, setDocument] = useState<Document | null>(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const result = await API.get(`/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDocument(result.data);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
    console.log("Document ID:", id);
  }, [id]);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await API.post(
        `/documents/${id}/analyze`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!document) {
    return <p>Loading document details...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{document.filename}</h1>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Extracted Text:</h2>
        <p className="text-gray-700">{document.extractedText}</p>
      </div>
      <form onSubmit={handleQuerySubmit} className="mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-2"
          placeholder="Type your query here..."
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : "Ask AI"}
        </Button>
      </form>
      {response && (
        <div className="p-4 bg-blue-100 rounded">
          <h2 className="text-lg font-semibold mb-2">AI Response:</h2>
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
}
