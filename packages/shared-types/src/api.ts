import type { User } from './domain';

export interface ApiError {
  readonly statusCode: number;
  readonly message: string;
  readonly error: string;
}

export interface ApiResponse<T> {
  readonly data: T;
  readonly message?: string;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly user: User;
}

export interface RegisterRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface RegisterResponse {
  readonly user: User;
}
