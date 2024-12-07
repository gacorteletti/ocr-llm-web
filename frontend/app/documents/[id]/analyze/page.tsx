"use client";

import { useState, useEffect, useRef } from "react";
import API from "../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../components/Button";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface Document {
  id: number;
  filename: string;
  extractedText: string;
  url: string;
}

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AnalyzePage() {
  const { id } = useParams(); // fetch doc ID from URL path
  const [doc, setDoc] = useState<Document | null>(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat (for auto-scroll)

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
    const fetchDocumentAndInteractions = async () => {
      try {
        // Get document
        const docResult = await API.get(`/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDoc(docResult.data);

        // Get interactions with this document
        const interactionsResult = await API.get(
          `/documents/${id}/interactions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Fetches message history
        const fetchedMessages = interactionsResult.data.flatMap(
          (interaction: any) => [
            { role: "user", content: interaction.query },
            { role: "ai", content: interaction.response },
          ]
        );
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocumentAndInteractions();
  }, [id]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return; // if query empty, skip it

    const newMessage: Message = { role: "user", content: query }; // obtain new query
    setMessages((prev) => [...prev, newMessage]); // append to history

    setQuery(""); // clear chat input
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
      const aiResponse: Message = { role: "ai", content: result.data.response }; // obtain reply
      setMessages((prev) => [...prev, aiResponse]); // append to chat
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!doc) {
    return <p>Loading document details...</p>;
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
        <div className="flex-grow flex flex-col bg-white shadow-md rounded p-4">
          <div
            className="flex-grow overflow-y-auto mb-4 text-black"
            style={{ maxHeight: "300px" }}
            ref={chatContainerRef}
          >
            <h2 className="text-md text-center text-black font-bold mb-1">
              AI CHAT
            </h2>
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    message.role === "user"
                      ? "bg-gray-200 text-right"
                      : "bg-blue-200 text-left"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleQuerySubmit} className="flex">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow border border-gray-600 rounded p-2 mr-2 text-black placeholder-gray-600"
              placeholder="Type your query here..."
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
