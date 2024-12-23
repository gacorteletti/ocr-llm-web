"use client";

import { useRouter } from "next/navigation";

interface DocumentPanelProps {
  id: number;
  filename: string;
  url: string;
  createdAt: string;
  onDelete: (id: number) => void;
}

export default function DocumentPanel({
  id,
  filename,
  url,
  onDelete,
}: DocumentPanelProps) {
  const router = useRouter();

  const handleAnalyze = () => {
    router.push(`/documents/${id}/analyze`);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the analyze logic

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the analyze logic

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

      if (!response.ok) {
        throw new Error("Failed to delete the document");
      }

      onDelete(id); // notify parent to remove document from grid
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div
      className="flex flex-col justify-between bg-white border-4 border-gray-400 shadow-2xl rounded-xl p-4 hover:shadow-black cursor-pointer transition-all"
      onClick={handleAnalyze} // Clicking anywhere on the panel triggers analyze
    >
      <div className="flex justify-between items-center px-2 py-1">
        <span
          className="text-lg text-black font-bold truncate"
          title={filename}
        >
          {filename}
        </span>
        <div className="flex space-x-1">
          <button
            onClick={handleDownload}
            className="text-blue-500 mr-1 text-4xl hover:text-blue-700"
          >
            ⬇
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 text-3xl hover:text-red-700"
          >
            ✖
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <img
          src={url}
          alt={filename}
          className="w-full h-full object-cover"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
