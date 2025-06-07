'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'EMPLOYEE' | 'MANAGER';
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company: string;
  role: 'EMPLOYEE' | 'MANAGER';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 토큰에서 사용자 정보 추출
  const getUserFromToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        companyId: payload.companyId,
        role: payload.role,
      };
    } catch {
      return null;
    }
  };

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    if (storedToken) {
      const userData = getUserFromToken(storedToken);
      if (userData) {
        setToken(storedToken);
        setUser(userData);
        // 토큰 갱신 시도
        refreshTokenIfNeeded(storedToken);
      } else {
        localStorage.removeItem('auth-token');
      }
    }
    setIsLoading(false);
  }, []);

  // 토큰 자동 갱신
  const refreshTokenIfNeeded = async (currentToken: string) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const { token: newToken } = await response.json();
        if (newToken !== currentToken) {
          localStorage.setItem('auth-token', newToken);
          setToken(newToken);
          const userData = getUserFromToken(newToken);
          if (userData) setUser(userData);
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.status !== 201) {
        throw new Error(response.data.message || '로그인에 실패했습니다.');
      }

      const { accessToken: newToken, user: userData } = response.data;

      localStorage.setItem('auth-token', newToken);
      setToken(newToken);
      setUser(userData);

      router.push('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '회원가입에 실패했습니다.');
      }

      const { token: newToken, user: newUser } = await response.json();

      localStorage.setItem('auth-token', newToken);
      setToken(newToken);
      setUser(newUser);

      router.push('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('auth-token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  // 토큰 자동 갱신 (30분마다)
  useEffect(() => {
    if (token) {
      const interval = setInterval(
        () => {
          refreshTokenIfNeeded(token);
        },
        30 * 60 * 1000,
      ); // 30분

      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
