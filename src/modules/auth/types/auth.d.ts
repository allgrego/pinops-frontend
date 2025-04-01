import { UserRoles } from "../setup/auth";

export type UserRoleKey = keyof typeof UserRoles;

export type UserRole = (typeof UserRoles)[UserRoleKey];
