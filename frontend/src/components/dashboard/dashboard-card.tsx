import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  content: ReactNode | string;
  description: string;
  icon: ReactNode;
  contentSpacer?: boolean;
}

export function DashboardCard({
  title,
  content,
  description,
  icon,
  contentSpacer = false,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className={cn(contentSpacer && 'space-y-2')}>
        <div className="text-2xl font-bold">{content}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
