/**
 * Standardized error response shape returned by the keepwatching API.
 * All fields are optional because the server may omit any of them depending
 * on the error type and the middleware that handled it.
 */
export interface ApiErrorResponse {
  /** Human-readable top-level error description. */
  message?: string;
  /** Unique identifier for the request, useful for correlating server logs. */
  requestId?: string;
  /** HTTP status code associated with the error (e.g., 400, 401, 500). */
  status?: number;
  /** Structured error detail provided by the API error handler. */
  error?: {
    /** Machine-readable error code (e.g., `"UNAUTHORIZED"`, `"NOT_FOUND"`). */
    code: string;
    /** Detailed description of the error suitable for display. */
    message: string;
  };
}
