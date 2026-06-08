import type { AuthClientError } from './authClient.types';
import type {
  ApiError,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@portfolio/shared-types';

const BASE_URL = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json()) as ApiError;
    const error: AuthClientError = new Error(body.message);
    error.statusCode = body.statusCode;
    throw error;
  }
  return response.json() as Promise<T>;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(request),
  });
  return handleResponse<LoginResponse>(response);
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(request),
  });
  return handleResponse<RegisterResponse>(response);
}
