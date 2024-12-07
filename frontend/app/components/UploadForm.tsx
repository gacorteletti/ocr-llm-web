"use client";

import API from "../../lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // whenever a file is selected in the file input field
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // check if files were select
      setFile(e.target.files[0]); // selects only 1
    }
  };

  // submission of form and upload selected file to server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page refresh
    if (!file) {
      setError("Please select ONE file to upload.");
      return;
    }
    setLoading(true); // flag upload in progress
    setError(null);

    const formData = new FormData();
    formData.append("file", file); // append selected file to FormData object

    try {
      // post request with auth token
      await API.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      router.push("/documents"); // redirect on success
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message); // backend error message
      } else {
        setError("Failed to upload document."); // generic error message
      }
    } finally {
      setLoading(false);
    }
  };

  // triggers the file upload logic
  // triggers the file selection logic
  return (
    <form
      onSubmit={handleSubmit}
      className="w-96 p-6 bg-white shadow-md rounded"
    >
      <h1 className="text-2xl text-center text-black font-bold mb-4">
        UPLOAD AN IMAGE
      </h1>
      {error && (
        <p className="text-red-500 text-center font-bold mb-4">{error}</p>
      )}
      <div className="flex flex-col items-center mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:bg-gray-500 file:text-white file:cursor-pointer file:hover:bg-gray-700"
          required
        />
      </div>
      <div className="flex justify-between items-center space-x-4">
        <Button type="submit" disabled={loading} className="flex-grow w-2/3">
          {loading ? "UPLOADING..." : "UPLOAD"}
        </Button>
        <Button
          onClick={() => router.push("/documents")}
          className="bg-gray-500 hover:bg-gray-400"
        >
          Return
        </Button>
      </div>
    </form>
  );
}
