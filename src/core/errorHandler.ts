import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export type AppError =
  | { type: 'network';        message: string }
  | { type: 'unauthorized';   message: string }
  | { type: 'forbidden';      message: string }
  | { type: 'not_found';      message: string }
  | { type: 'validation';     message: string; fields?: Record<string, string[]> }
  | { type: 'server';         message: string }
  | { type: 'unknown';        message: string };

export function classifyError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    if (!error.response) return { type: 'network', message: 'Network error. Check your connection.' };

    switch (error.response.status) {
      case 401: return { type: 'unauthorized', message: 'Session expired. Please log in again.' };
      case 403: return { type: 'forbidden',    message: 'You do not have permission to do this.' };
      case 404: return { type: 'not_found',    message: 'The requested resource was not found.' };
      case 422: return { type: 'validation',   message: 'Validation failed.', fields: error.response.data?.errors };
      case 500: return { type: 'server',       message: 'Server error. Please try again later.' };
      default:  return { type: 'unknown',      message: error.response.data?.message || 'An unexpected error occurred.' };
    }
  }
  if (error instanceof Error) return { type: 'unknown', message: error.message };
  return { type: 'unknown', message: 'An unexpected error occurred.' };
}

export function handleApiError(error: unknown): void {
  const appError = classifyError(error);

  if (appError.type === 'unauthorized') {
    localStorage.removeItem('matajer_token');
    window.location.href = '/login';
    return;
  }

  toast.error(appError.message, { duration: 4000 });
}
