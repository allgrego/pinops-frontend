import NextAuth from "next-auth";

import { User } from "@/modules/auth/types/user";

// TODO make this
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});

// Password for all users
export const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || "";

if (!DEFAULT_PASSWORD) {
  throw new Error("NEXT_PUBLIC_DEFAULT_PASSWORD env var not defined");
}

/**
 *  - - - Units types options
 */
export const UserRoles = {
  ADMIN: "admin",
  USER: "user",
  // Add others here
} as const;

// Mock users
// TODO Remove this and obtain the data from backend
export const users: User[] = [
  // Admin
  {
    id: "c6accde6-b847-4aca-b9e5-23b0939f884b",
    email: "admin@gbalogistic.com",
    name: "System Admin",
    role: UserRoles.ADMIN,
  },
  // Demo
  {
    id: "ca939389-d3ca-49c8-8add-e8190dc3fef6",
    email: "demo@gbalogistic.com",
    name: "Demo User",
    role: UserRoles.USER,
  },
  // Other users
  {
    id: "ca939389-d3ca-49c8-8add-e8190dc3fef6",
    email: "galvarez@gbalogistic.com",
    name: "Gregorio Álvarez",
    role: UserRoles.ADMIN,
  },
  {
    id: "ca939389-d3ca-49c8-8add-e8190dc3fef6",
    email: "mgil@gbalogistic.com",
    name: "María Fernanda Gil",
    role: UserRoles.ADMIN,
  },
  {
    id: "ca939389-d3ca-49c8-8add-e8190dc3fef6",
    email: "rgil@gbalogistic.com",
    name: "Ricardo Gil",
    role: UserRoles.ADMIN,
  },
  {
    id: "ca939389-d3ca-49c8-8add-e8190dc3fef6",
    email: "kbaena@gbalogistic.com",
    name: "Karolyna Baena",
    role: UserRoles.ADMIN,
  },
  {
    id: "ca939389-d3ca-49c8-8add-e8190dc3fef6",
    email: "ccuervo@gbalogistic.com",
    name: "Carlos Cuervo",
    role: UserRoles.USER,
  },
] as const;
