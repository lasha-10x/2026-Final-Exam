export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

// Utility type: the editable part of the user is a slice of AuthUser.
export type ProfileForm = Pick<AuthUser, "firstName" | "lastName" | "email" | "phone">;
