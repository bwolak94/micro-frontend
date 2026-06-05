export interface ApiClientConfig {
  readonly baseUrl: string;
  readonly getToken?: () => string | null | undefined;
}

export class ApiRequestError extends Error {
  readonly statusCode: number;
  readonly errorType: string;

  constructor(message: string, statusCode: number, errorType: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}
