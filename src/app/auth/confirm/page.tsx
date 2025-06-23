"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmPageContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        if (!token_hash || !type) {
          setStatus("error");
          setMessage("Invalid confirmation link. Please try again.");
          return;
        }

        // Use the API endpoint to avoid direct Supabase client issues
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token_hash, type }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus("success");
          setMessage(
            "Email confirmed successfully! Redirecting to dashboard..."
          );

          // Redirect after success
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(result.error || "Confirmation failed. Please try again.");
        }
      } catch (error) {
        console.error("Confirmation error:", error);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    handleConfirmation();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Confirming Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-600 text-6xl">✓</div>
            <h2 className="text-2xl font-bold text-green-900">
              Email Confirmed!
            </h2>
            <p className="text-green-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-600 text-6xl">✗</div>
            <h2 className="text-2xl font-bold text-red-900">
              Confirmation Failed
            </h2>
            <p className="text-red-600">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/register")}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Try Registering Again
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      }
    >
      <ConfirmPageContent />
    </Suspense>
  );
}
