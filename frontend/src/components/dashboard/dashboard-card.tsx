import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardCardProps {
  title: string;
  content: ReactNode | string;
  description: string;
  icon: ReactNode;
  isLoading?: boolean;
}

export function DashboardCard({
  title,
  content,
  description,
  icon,
  isLoading = false,
}: DashboardCardProps) {
  return isLoading ? (
    <Skeleton className="h-32" />
  ) : (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{content}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
