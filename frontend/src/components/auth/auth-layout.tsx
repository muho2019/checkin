import type React from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* 왼쪽 브랜딩 섹션 */}
      <div className="hidden bg-muted lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">근태</span>
            </div>
            <h1 className="text-2xl font-bold">근태 관리</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">효율적인 근태 관리 시스템</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            직원들의 출퇴근을 간편하게 관리하고, 실시간으로 근태 현황을 확인하세요.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-sm">실시간 출퇴근 기록</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-sm">상세한 근태 통계</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-sm">직원 및 관리자 권한 관리</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 폼 섹션 */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-center space-x-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground">근태</span>
            </div>
            <h1 className="text-xl font-bold">근태 관리</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
