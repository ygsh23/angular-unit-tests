export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
