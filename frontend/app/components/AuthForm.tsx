"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../lib/api";
import Link from "next/link";
import Button from "./Button";

interface AuthFormProps {
  type: "signin" | "signup"; // define form type
  endpoint: string; // backend endpoint for the form
  redirectTo: string; // path to redirect after success
  linkText?: string; // optional text for link below button
  linkHref?: string; // optional href for the link
}

export default function AuthForm({
  type,
  endpoint,
  redirectTo,
  linkText,
  linkHref,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post(endpoint, { email, password });
      if (type === "signin") {
        localStorage.setItem("token", response.data.access_token); // Save JWT for signin
      }
      router.push(redirectTo); // Redirect on success
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null) {
        setError((err as any).response?.data?.message || `${type} failed`);
      } else {
        setError(`${type} failed`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 bg-white shadow-md rounded"
      >
        <h1 className="text-2xl text-center text-black font-bold mb-4">
          {type === "signin"
            ? "LOG IN TO YOUR ACCOUNT"
            : "CREATE A NEW ACCOUNT"}
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
          required
        />
        <Button type="submit" className="w-full">
          {type === "signin" ? "ENTER" : "CREATE"}
        </Button>
        {linkText && linkHref && (
          <Link
            href={linkHref}
            className="block text-sm text-center font-bold mt-2 text-blue-500 hover:underline"
          >
            {linkText} {type === "signin" ? "Sign Up!" : "Sign In!"}
          </Link>
        )}
      </form>
    </div>
  );
}
