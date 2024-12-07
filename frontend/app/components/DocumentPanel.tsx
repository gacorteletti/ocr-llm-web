"use client";

import { useRouter } from "next/navigation";

interface DocumentPanelProps {
  id: number;
  filename: string;
  url: string;
  createdAt: string;
}

export default function DocumentPanel({
  id,
  filename,
  url,
}: DocumentPanelProps) {
  const router = useRouter();

  const handleAnalyze = () => {
    router.push(`/documents/${id}/analyze`);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from triggering the analyze logic
    window.open(url, "_blank");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from triggering the analyze logic
    alert("Delete functionality coming soon!");
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
            className="text-blue-500 text-4xl hover:text-blue-700"
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
        <img src={url} alt={filename} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
