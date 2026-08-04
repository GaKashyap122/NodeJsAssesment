export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UserListItem extends User {
  createdAt: string;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: string;
  exp: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface SignupResponse {
  message: string;
  userId: number;
}

export interface UserListResponse {
  data: UserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
