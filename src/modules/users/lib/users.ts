import {
  User,
  UserBackend,
  UserRole,
  UserRoleBackend,
} from "../types/users.types";

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
