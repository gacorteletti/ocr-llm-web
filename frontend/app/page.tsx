import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center max-w-lg p-6 bg-white rounded shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to DocChat
        </h1>
        <p className="text-gray-700 mb-6">
          Want some help understanding any document? Create an account, upload a
          picture of the document you desire, and begin chatting with our AI
          assistant about your document.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/signup"
            className="py-2 px-4 font-semibold rounded bg-blue-500 text-white hover:bg-blue-600 text-center"
          >
            Create an Account
          </Link>
          <Link
            href="/signin"
            className="py-2 px-4 font-semibold rounded bg-gray-200 text-gray-800 hover:bg-gray-300 text-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
