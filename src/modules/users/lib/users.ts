import { getRoute } from "@/core/lib/routes";
import {
  User,
  UserBackend,
  UserRole,
  UserRoleBackend,
} from "@/modules/users/types/users.types";

/**
 * - - - - User roles
 */

/**
 * Transform user role from backend schema into internal schema
 *
 * @param {UserRoleBackend} userRole
 *
 * @returns {UserRole}
 */
export const serializeUserRole = (role: UserRoleBackend): UserRole => {
  const serializedUserRole: UserRole = {
    roleId: role.role_id,
    roleName: role.role_name,
  };

  return serializedUserRole;
};

/**
 * - - - - Users
 */

/**
 * Transform user from backend schema into internal schema
 *
 * @param {UserBackend} user
 *
 * @returns {User}
 */
export const serializeUser = (user: UserBackend): User => {
  const serializedUser: User = {
    userId: user.user_id,
    name: user.name,
    email: user.email,
    role: serializeUserRole(user.role),
    disabled: user?.disabled || false,
  };

  return serializedUser;
};

/**
 * Get all users
 *
 * @return {User[]}
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const url = getRoute("backend-users-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: UserBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const users: User[] = jsonResponse.map((user) => serializeUser(user));

    return users;
  } catch (error) {
    console.error("Failure getting all users", error);
    throw error;
  }
};
