import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_PASSWORD, users } from "@/modules/auth/setup/auth";
import { User } from "@/modules/auth/types/user";

// Authentication functions
export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
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
        // TODO validate the password here

        const user = findUserByEmail(email);

        if (!user || password.trim() !== DEFAULT_PASSWORD?.trim()) {
          return { success: false, message: "Invalid email or password" };
        }

        set({ user, isAuthenticated: true });
        return { success: true };
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
