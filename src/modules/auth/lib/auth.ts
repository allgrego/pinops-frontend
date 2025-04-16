import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getRoute } from "@/core/lib/routes";

import { UserLoginBackend } from "@/modules/auth/types/auth";
import { User } from "@/modules/auth/types/user";

/**
 * Login by getting user data from backend if valid credentials
 *
 * @param {string} email
 * @param {string} password
 *
 * @return {Promise<User | null>} user data if valid credentials, null otherwise
 */
export const validateCredentials = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const url = getRoute("backend-login");

    const body: UserLoginBackend = {
      email: email.trim().toLowerCase(),
      password: password,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      return null; // Invalid credentials
    }
    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const user: User | undefined = await response.json();

    if (!user) {
      throw new Error("No data obtained on login");
    }

    return user;
  } catch (error) {
    console.error("Failure logging in:", error);
    throw error;
  }
};

// Auth store with Zustand
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: (callback?: () => void) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    // Previously (set, get) =>
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const user = await validateCredentials(email, password);

          if (!user) {
            return { success: false, message: "Invalid credentials" };
          }

          set({ user, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          console.error("Failure in login", error);
          return { success: false, message: `Unable to login. ${error}` };
        }
      },

      logout: (callback) => {
        set({ user: null, isAuthenticated: false });
        callback?.();
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
