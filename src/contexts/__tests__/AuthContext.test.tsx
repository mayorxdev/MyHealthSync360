import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

// Create proper mock for Supabase
jest.mock("@/lib/supabase", () => {
  const mockSupabaseAuth = {
    getSession: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    onAuthStateChange: jest.fn(),
  };

  return {
    supabase: {
      auth: mockSupabaseAuth,
    },
  };
});

import { supabase } from "@/lib/supabase";

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  const mockSupabaseAuth = supabase.auth as any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    mockSupabaseAuth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });

  describe("useAuth hook", () => {
    it("should provide initial auth state", async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.state).toEqual({
        user: null,
        isLoading: false,
        isLoggedIn: false,
      });
    });

    it("should handle successful login", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        user_metadata: {
          full_name: "Test User",
        },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };

      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { user: mockUser } },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login(
          "test@example.com",
          "password"
        );
      });

      expect(loginResult!).toBe(true);
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });

    it("should handle failed login", async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: {
          message: "Invalid credentials",
          code: "invalid_credentials",
          status: 400,
          __isAuthError: true,
          name: "AuthError",
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login(
          "test@example.com",
          "wrongpassword"
        );
      });

      expect(loginResult!).toBe(false);
    });

    it("should handle successful registration", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        user_metadata: {},
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };

      mockSupabaseAuth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: null,
        },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      let registerResult: any;
      await act(async () => {
        registerResult = await result.current.register({
          email: "test@example.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        });
      });

      expect(registerResult.success).toBe(true);
      expect(registerResult.needsConfirmation).toBe(true);
    });

    it("should handle registration with existing email", async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: {
          message: "User already registered",
          code: "user_already_exists",
          status: 400,
          __isAuthError: true,
          name: "AuthError",
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      let registerResult: any;
      await act(async () => {
        registerResult = await result.current.register({
          email: "existing@example.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        });
      });

      expect(registerResult.success).toBe(false);
      expect(registerResult.error).toBe("User already registered");
    });

    it("should handle logout", async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    });

    it("should handle password reset", async () => {
      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      let resetResult: any;
      await act(async () => {
        resetResult = await result.current.resetPassword("test@example.com");
      });

      expect(resetResult.success).toBe(true);
      expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com",
        { redirectTo: expect.stringContaining("reset-password") }
      );
    });

    it("should update user profile", async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      // First set a user
      act(() => {
        result.current.state.user = {
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        };
      });

      const updateData = { name: "Updated Name" };

      act(() => {
        result.current.updateUser(updateData);
      });

      expect(result.current.state.user?.name).toBe("Updated Name");
    });
  });

  describe("auth state changes", () => {
    it("should handle SIGNED_IN event", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        user_metadata: {
          full_name: "Test User",
        },
      };

      let authStateCallback: any;
      mockSupabaseAuth.onAuthStateChange.mockImplementation((callback: any) => {
        authStateCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
              id: "test-subscription",
              callback: jest.fn(),
            },
          },
        };
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      // Simulate SIGNED_IN event
      await act(async () => {
        await authStateCallback("SIGNED_IN", { user: mockUser });
      });

      await waitFor(() => {
        expect(result.current.state.isLoggedIn).toBe(true);
      });

      expect(result.current.state.user?.email).toBe("test@example.com");
    });

    it("should handle SIGNED_OUT event", async () => {
      let authStateCallback: any;
      mockSupabaseAuth.onAuthStateChange.mockImplementation((callback: any) => {
        authStateCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
              id: "test-subscription",
              callback: jest.fn(),
            },
          },
        };
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      // Simulate SIGNED_OUT event
      await act(async () => {
        await authStateCallback("SIGNED_OUT", null);
      });

      expect(result.current.state.user).toBe(null);
      expect(result.current.state.isLoggedIn).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should handle session initialization errors gracefully", async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: {
          message: "Session error",
          code: "session_error",
          status: 500,
          __isAuthError: true,
          name: "AuthError",
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.state.user).toBe(null);
    });

    it("should handle unexpected errors during login", async () => {
      mockSupabaseAuth.signInWithPassword.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: TestWrapper,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login(
          "test@example.com",
          "password"
        );
      });

      expect(loginResult!).toBe(false);
    });
  });
});
