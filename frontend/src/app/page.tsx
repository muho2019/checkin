'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import { api, handleApiError } from '@/lib/api';
import { toast } from 'sonner';
import { endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { DashboardSummaryResponseDto, TodayAttendanceState } from '@/types/dashboard-response';

export function toDateTimeString(date?: Date | string): string {
  if (!date) return '-';

  const parsed = typeof date === 'string' ? parseISO(date) : date;

  return parsed.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function toDateString(date?: Date | string): string {
  if (!date) return '-';

  const parsed = typeof date === 'string' ? parseISO(date) : date;

  return parsed.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function toTimeString(date?: Date | string, second: boolean = true) {
  if (!date) return '-';

  const parsed = typeof date === 'string' ? parseISO(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(second && { second: '2-digit' }),
  };
  return parsed.toLocaleTimeString('ko-KR', options);
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<string>(toTimeString(new Date()));
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendanceState>({
    isCheckedIn: false,
    isCheckedOut: false,
    checkInDate: undefined,
    checkOutDate: undefined,
  });
  const [workingHoursThisWeek, setWorkingHoursThisWeek] = useState<number>(0);
  const [workingDaysThisMonth, setWorkingDaysThisMonth] = useState<number>(0);
  const [totalWorkingDaysThisMonth, setTotalWorkingDaysThisMonth] = useState<number>(0);
  const [averageWorkingHoursThisMonth, setAverageWorkingHoursThisMonth] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(toTimeString(new Date()));
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  let attendanceStatusBadge = (
    <Badge variant="default" className="bg-amber-300">
      출근 전
    </Badge>
  );
  if (todayAttendance.isCheckedOut) {
    attendanceStatusBadge = <Badge variant="outline">퇴근</Badge>;
  } else if (todayAttendance.isCheckedIn) {
    attendanceStatusBadge = (
      <Badge variant="default" className="bg-green-500 text-white">
        출근
      </Badge>
    );
  }

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await api.get('/dashboard/summary');
        const {
          isCheckedIn,
          isCheckedOut,
          checkInDate,
          checkOutDate,
          workingHoursThisWeek,
          workingDaysThisMonth,
          totalWorkingDaysThisMonth,
          averageWorkingHoursThisMonth,
        } = res.data as DashboardSummaryResponseDto;

        setTodayAttendance(() => ({
          isCheckedIn,
          isCheckedOut,
          checkInDate,
          checkOutDate,
        }));
        setWorkingHoursThisWeek(() => workingHoursThisWeek);
        setWorkingDaysThisMonth(() => workingDaysThisMonth);
        setTotalWorkingDaysThisMonth(() => totalWorkingDaysThisMonth);
        setAverageWorkingHoursThisMonth(() => averageWorkingHoursThisMonth);
      } catch (error) {
        handleApiError(error, '대시보드 정보를 불러오는 데 실패했습니다.');
      }
    }
    fetchDashboardData();
  }, []);

  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);

  const checkIn = async () => {
    try {
      const res = await api.post('/attendance/check-in');
      toast.success('출근 처리 되었습니다.', {
        description: `출근 시간: ${toTimeString(res.data.checkIn, false)}`,
      });
      setTodayAttendance(prev => ({
        ...prev,
        isCheckedIn: true,
        checkInDate: res.data.checkIn,
      }));
    } catch (error) {
      handleApiError(error, '출근 기록 저장에 실패했습니다.');
    }
  };
  const checkOut = async () => {
    try {
      const res = await api.post('/attendance/check-out');
      toast.success('퇴근 처리 되었습니다.', {
        description: `퇴근 시간: ${toTimeString(res.data.checkOut, false)}`,
      });
      setTodayAttendance(prev => ({
        ...prev,
        isCheckedOut: true,
        checkOutDate: res.data.checkOut,
      }));
    } catch (error) {
      handleApiError(error, '퇴근 기록 저장에 실패했습니다.');
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
            <p className="text-muted-foreground">오늘의 근태 현황을 확인하세요</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              title="출근 상태"
              content={attendanceStatusBadge}
              description={`현재시간: ${currentTime}`}
              contentSpacer
            />
            <DashboardCard
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              title="이번 주 근무시간"
              content={`${workingHoursThisWeek}시간`}
              description="목표: 40시간"
              contentSpacer
            />
            <DashboardCard
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              title="이번 달 출근일"
              content={`${workingDaysThisMonth}일`}
              description={`총 ${totalWorkingDaysThisMonth}일 중`}
              contentSpacer
            />
            <DashboardCard
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              title="평균 근무시간"
              content={`${averageWorkingHoursThisMonth.toFixed(1)}시간`}
              description={`일일 평균 (${toDateString(firstDayOfMonth)} ~ ${toDateString(lastDayOfMonth)})`}
              contentSpacer
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>오늘의 출퇴근 기록</CardTitle>
                <CardDescription>오늘의 출퇴근을 기록하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    className="flex-1"
                    disabled={todayAttendance.isCheckedIn}
                    variant={todayAttendance.isCheckedIn ? 'secondary' : 'default'}
                    onClick={() => checkIn()}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    출근
                  </Button>
                  <Button
                    className="flex-1"
                    variant={
                      todayAttendance.isCheckedIn && todayAttendance.isCheckedOut
                        ? 'secondary'
                        : 'default'
                    }
                    disabled={!todayAttendance.isCheckedIn || todayAttendance.isCheckedOut}
                    onClick={() => checkOut()}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    퇴근
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {todayAttendance.isCheckedIn ? (
                    <p>출근시간: {toDateTimeString(todayAttendance.checkInDate)}</p>
                  ) : (
                    <p>출근 전 입니다.</p>
                  )}
                  {todayAttendance.isCheckedOut && (
                    <p>퇴근시간: {toDateTimeString(todayAttendance.checkOutDate)}</p>
                  )}
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
