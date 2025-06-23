"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
      <p className="text-gray-600">
        Please wait while we verify your authentication.
      </p>
    </div>
  </div>
);

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  loadingComponent,
}: ProtectedRouteProps) {
  const { state } = useAuth();
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.isLoading) {
        console.warn("Auth loading timeout reached, forcing state update");
        setTimeoutReached(true);
      }
    }, 2000); // 2 second timeout

    return () => clearTimeout(timer);
  }, [state.isLoading]);

  useEffect(() => {
    // Only redirect if auth is fully loaded and user is not logged in, or timeout reached
    if (
      (!state.isLoading && !state.isLoggedIn) ||
      (timeoutReached && !state.isLoggedIn)
    ) {
      // Store the current path to redirect back after login
      const currentPath = window.location.pathname;
      if (currentPath !== redirectTo) {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
      }
      router.push(redirectTo);
    }
  }, [state.isLoading, state.isLoggedIn, timeoutReached, router, redirectTo]);

  // Show loading while checking authentication (unless timeout reached)
  if (state.isLoading && !timeoutReached) {
    return loadingComponent || <LoadingSpinner />;
  }

  // If timeout reached but no clear auth state, show error message
  if (timeoutReached && !state.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Timeout
          </h2>
          <p className="text-gray-600 mb-4">
            We're having trouble verifying your authentication. Please try
            refreshing the page or logging in again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors mr-3"
          >
            Refresh Page
          </button>
          <button
            onClick={() => router.push(redirectTo)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!state.isLoggedIn) {
    return loadingComponent || <LoadingSpinner />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
