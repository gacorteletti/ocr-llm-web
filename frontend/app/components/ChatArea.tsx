"use client";

import { useState, useEffect, useRef } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";
import Button from "../components/Button";

interface Message {
  role: "user" | "ai";
  content: string;
}

// Requires doc id (str because it comes from useParams -- fetch from URL)
export default function ChatArea({ id }: { id: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat (for auto-scroll)

  useEffect(() => {
    const fetchInteractions = async () => {
      setLoading(true);
      try {
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
      } catch (err: any) {
        setError("Unauthorized Access");
        setTimeout(() => {
          router.push("/documents"); // 3s to redirect
        }, 300);
      }
      setLoading(false);
    };

    fetchInteractions();
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

  if (error) {
    return (
      <div className="w-32 p-6 bg-red-100 mx-auto shadow-lg rounded-lg">
        <h1 className="text-xl text-center font-bold text-red-700">{error}</h1>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-white shadow-md rounded p-4">
      <div
        className="flex-grow mb-4 text-black"
        // ref={chatContainerRef}
      >
        <h2 className="text-md text-center text-black font-bold mb-1">
          AI CHAT
        </h2>
        <div
          className="space-y-2 overflow-y-auto"
          style={{ maxHeight: "300px" }}
          ref={chatContainerRef}
        >
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
  );
}
