"use client";

import { useEffect } from "react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-slate-600 mb-6">
            {error.message || "Something went wrong. Please try again."}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/login"
              className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors inline-block"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
