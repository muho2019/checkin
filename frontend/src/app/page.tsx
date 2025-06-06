import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';

export default function Dashboard() {
  const currentTime = new Date().toLocaleString('ko-KR');
  const isCheckedIn = false; // 실제로는 API에서 가져와야 함

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
            <p className="text-muted-foreground">오늘의 근태 현황을 확인하세요</p>
          </div>

          {/* 출퇴근 상태 카드 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">출근 상태</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isCheckedIn ? (
                    <Badge variant="default" className="bg-green-500">
                      출근
                    </Badge>
                  ) : (
                    <Badge variant="secondary">미출근</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{currentTime}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">이번 주 근무시간</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32시간</div>
                <p className="text-xs text-muted-foreground">목표: 40시간</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">이번 달 출근일</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18일</div>
                <p className="text-xs text-muted-foreground">총 22일 중</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">평균 근무시간</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2시간</div>
                <p className="text-xs text-muted-foreground">일일 평균</p>
              </CardContent>
            </Card>
          </div>

          {/* 출퇴근 기록 카드 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>출퇴근 기록</CardTitle>
                <CardDescription>오늘의 출퇴근을 기록하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    className="flex-1"
                    disabled={isCheckedIn}
                    variant={isCheckedIn ? 'secondary' : 'default'}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    출근
                  </Button>
                  <Button className="flex-1" variant="outline" disabled={!isCheckedIn}>
                    <Clock className="mr-2 h-4 w-4" />
                    퇴근
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {isCheckedIn ? <p>출근 시간: 09:00 AM</p> : <p>아직 출근하지 않았습니다</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>최근 근태 기록</CardTitle>
                <CardDescription>최근 5일간의 근태 기록</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', hours: '8시간' },
                    {
                      date: '2024-01-14',
                      checkIn: '09:15',
                      checkOut: '18:30',
                      hours: '8시간 15분',
                    },
                    { date: '2024-01-13', checkIn: '08:45', checkOut: '17:45', hours: '8시간' },
                    { date: '2024-01-12', checkIn: '09:00', checkOut: '18:00', hours: '8시간' },
                    { date: '2024-01-11', checkIn: '09:30', checkOut: '18:30', hours: '8시간' },
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{record.date}</span>
                      <div className="flex space-x-2 text-muted-foreground">
                        <span>{record.checkIn}</span>
                        <span>-</span>
                        <span>{record.checkOut}</span>
                        <Badge variant="outline" className="ml-2">
                          {record.hours}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
