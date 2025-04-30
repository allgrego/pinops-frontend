import { UserRolesIds } from "@/modules/auth/setup/auth";

export type UserRoleIdKey = keyof typeof UserRolesIds;

export type UserRoleId = (typeof UserRoles)[UserRoleIdKey];

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
