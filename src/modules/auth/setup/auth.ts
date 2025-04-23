import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});

// Password for all users
export const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || "";

if (!DEFAULT_PASSWORD) {
  throw new Error("NEXT_PUBLIC_DEFAULT_PASSWORD env var not defined");
}

/**
 *  - - - User roles options
 */
// IMPORTANT: Must be consistent with DB users roles
export const UserRoles = {
  ADMIN: "admin",
  OPS_MANAGER: "ops_manager",
  TRAFFIC_OPERATOR: "traffic_operator",
  SELLER: "seller",
  // Add others here
} as const;
