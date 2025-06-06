'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  BarChart3,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: '대시보드',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: '근태 기록',
    href: '/attendance',
    icon: Clock,
  },
  {
    title: '근태 통계',
    href: '/statistics',
    icon: BarChart3,
  },
  {
    title: '직원 관리',
    href: '/employees',
    icon: Users,
    role: 'MANAGER', // MANAGER만 접근 가능
  },
  {
    title: '설정',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const userRole = 'EMPLOYEE'; // 실제로는 context나 props에서 가져와야 함

  const filteredMenuItems = menuItems.filter(item => !item.role || item.role === userRole);

  return (
    <div
      className={cn(
        'relative flex flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && <span className="text-lg font-semibold">메뉴</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                  collapsed && 'justify-center',
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
