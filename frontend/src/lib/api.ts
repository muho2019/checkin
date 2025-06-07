import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

export function handleApiError(
  error: unknown,
  fallbackMessage = '알 수 없는 오류가 발생했습니다.',
) {
  const err = error as AxiosError<ApiErrorResponse>;

  const message = err.response?.data?.message || fallbackMessage;

  toast.error(message);
}
