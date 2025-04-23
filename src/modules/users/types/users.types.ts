/**
 * - - - - User role
 */
// Backend
export interface UserRoleBaseBackend {
  role_name: string;
}

export interface UserRoleBackend extends UserRoleBaseBackend {
  role_id: string;
}

// No creation or update by now

// Internal
export interface UserRoleBase {
  role_name: UserRoleBaseBackend["role_name"];
}

export interface UserRole extends UserRoleBase {
  role_id: UserRoleBackend["role_id"];
}

/**
 * - - - - User
 */

// Backend
export interface UserBaseBackend {
  name: string;
  email: string;
  disabled?: boolean;
}

export interface UserBackend extends UserBaseBackend {
  user_id: string;
  role: UserRoleBackend;
}

export interface UserCreateBackend extends UserBaseBackend {
  password: string;
  role_id: string;
}

export type UserUpdateBackend = Partial<
  UserBaseBackend & {
    password?: string;
    role_id?: string;
  }
>;

// Internal
export interface UserBase {
  name: UserBaseBackend["name"];
  email: UserBaseBackend["email"];
  disabled?: UserBaseBackend["disabled"];
}

export interface User extends UserBase {
  userId: UserBackend["user_id"];
  role: UserRole;
}

export interface UserCreate extends UserBase {
  password: UserCreateBackend["name"];
  role_id: UserCreateBackend["role_id"];
}

export type UserUpdate = Partial<
  UserBase & {
    password?: UserUpdateBackend["password"];
    role_id?: UserUpdateBackend["role_id"];
  }
>;
