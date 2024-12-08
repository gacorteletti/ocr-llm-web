"use client";

import { useState, useEffect } from "react";
import API from "../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../components/Button";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ChatArea from "../../../components/ChatArea";

interface Document {
  id: number;
  filename: string;
  extractedText: string;
  url: string;
}

export default function AnalyzePage() {
  const { id } = useParams(); // fetch doc ID from URL path
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmed) return;

    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/${id}`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(backendUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Document deleted successfully");
        router.push("/documents");
      } else {
        throw new Error("Failed to delete the document");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Error deleting document.");
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/download/${id}`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(backendUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to download the file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "";
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        // Get document
        const docResult = await API.get(`/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDoc(docResult.data);
      } catch (err: any) {
        setError("Unauthorized Access");
        setTimeout(() => {
          router.push("/documents"); // 3s to redirect
        }, 300);
      }
      setLoading(false);
    };

    fetchDocument();
  }, [id]);

  if (loading) {
    return (
      <p className="text-white text-2xl text-center mt-20">
        Loading document details...
      </p>
    );
  }

  if (error) {
    return (
      <div className="w-96 p-6 bg-red-100 mt-40 mx-auto shadow-lg rounded-lg">
        <h1 className="text-2xl text-center font-bold text-red-700">{error}</h1>
      </div>
    );
  }

  if (!doc) {
    return null; // fallback
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      {/* left panel: image */}
      <div className="col-span-1 flex flex-col bg-white shadow-md p-4 rounded">
        <div className="flex-grow overflow-hidden cursor-move">
          <TransformWrapper>
            <TransformComponent>
              <img
                src={doc.url}
                alt={doc.filename}
                className="w-full h-full object-contain"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="text-red-500 ml-5 text-6xl hover:text-red-700"
          >
            ✖
          </button>
          <Button
            onClick={() => router.push("/documents/upload")}
            className="mb-4 mt-4"
          >
            New Upload
          </Button>
          <Button
            onClick={() => router.push("/documents")}
            className="mb-4 mt-4"
          >
            Return
          </Button>

          <button
            onClick={handleDownload}
            className="text-blue-500 mr-5 text-8xl hover:text-blue-700"
          >
            ⬇
          </button>
        </div>
      </div>

      {/* right panel: text and ai */}
      <div className="col-span-2 flex flex-col space-y-2">
        {/* text */}
        <div className="mb-2 p-4 bg-white shadow-md rounded">
          <h2 className="text-md text-center text-black font-bold mb-1">
            EXTRACTED TEXT
          </h2>
          <div
            className="text-black overflow-y-scroll"
            style={{ maxHeight: "150px" }}
          >
            {doc.extractedText}
          </div>
        </div>

        {/* ai */}
        <ChatArea id={id as string} />
      </div>
    </div>
  );
}
