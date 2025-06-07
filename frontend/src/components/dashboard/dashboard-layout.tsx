import type React from 'react';
import { Header } from '@/components/common/header';
import { Sidebar } from '@/components/common/sidebar';
import { Footer } from '@/components/common/footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[2200px]">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
