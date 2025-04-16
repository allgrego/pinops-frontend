import { UserRoles } from "@/modules/auth/setup/auth";

export type UserRoleKey = keyof typeof UserRoles;

export type UserRole = (typeof UserRoles)[UserRoleKey];

/**
 * - - - Login
 */
// Backend
export interface UserLoginBackend {
  email: string;
  password: string;
}

// Internal
export interface UserLogin {
  email: UserLoginBackend["email"];
  password: UserLoginBackend["password"];
}
