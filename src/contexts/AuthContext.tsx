"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createUserWithId } from "@/lib/database";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: any;
  subscription?: {
    plan: string;
    status: string;
    nextBilling?: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{
    success: boolean;
    error?: string;
    needsConfirmation?: boolean;
  }>;
  confirmEmail: (
    email: string,
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  resendConfirmation: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isLoggedIn: false,
  });

  // Initialize auth state and listen for auth changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_IN" && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        setState({
          user: null,
          isLoading: false,
          isLoggedIn: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log("Loading user profile for:", supabaseUser.email);

      // Create user profile directly from auth data - no database calls
      const user: User = {
        id: supabaseUser.id,
        name:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.email?.split("@")[0] ||
          "User",
        email: supabaseUser.email!,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          supabaseUser.user_metadata?.full_name ||
            supabaseUser.email!.split("@")[0]
        )}&size=128&background=10b981&color=ffffff&bold=true`,
        phone: supabaseUser.user_metadata?.phone || null,
        address: null,
      };

      // Set user immediately - no waiting, no timeouts, no database calls
      setState({
        user,
        isLoading: false,
        isLoggedIn: true,
      });

      console.log("User profile loaded instantly from auth data:", user.email);
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Always set loading to false in case of error
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);

        // Handle post-login redirect
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectPath;
        }

        return true;
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{
    success: boolean;
    error?: string;
    needsConfirmation?: boolean;
  }> => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            full_name: `${userData.firstName} ${userData.lastName}`,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });

      if (error) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // If user is not confirmed, they need to verify their email
        if (!data.user.email_confirmed_at) {
          return {
            success: true,
            needsConfirmation: true,
          };
        }

        // Create user profile in our database using the Supabase user ID
        const newUser = await createUserWithId({
          id: data.user.id,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          phone: userData.phone,
        });

        if (!newUser) {
          return { success: false, error: "Failed to create user profile" };
        }

        return { success: true };
      }

      return { success: false, error: "Failed to create account" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const confirmEmail = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        console.error("Email confirmation error:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return { success: true };
      }

      return { success: false, error: "Failed to confirm email" };
    } catch (error) {
      console.error("Email confirmation error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const resendConfirmation = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        console.error("Resend confirmation error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Resend confirmation error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }

      setState({
        user: null,
        isLoading: false,
        isLoggedIn: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/verify?next=/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        confirmEmail,
        resendConfirmation,
        logout,
        updateUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
