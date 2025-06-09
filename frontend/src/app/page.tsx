'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import { api, handleApiError } from '@/lib/api';
import { toast } from 'sonner';
import { differenceInMinutes, endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import {
  DashboardRecentAttendanceRecord,
  DashboardSummaryResponse,
  TodayAttendanceState,
} from '@/types/dashboard-response';
import { Skeleton } from '@/components/ui/skeleton';

function toDateTimeString(date?: Date | string): string {
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

function toDateString(date?: Date | string, dayOfTheWeek: boolean = false): string {
  if (!date) return '-';

  const parsed = typeof date === 'string' ? parseISO(date) : date;

  return parsed.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(dayOfTheWeek && {
      weekday: 'short',
    }),
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

function calculateWorkDuration(
  checkIn: Date,
  checkOut: Date,
): {
  totalHours: number;
  formatted: string;
} {
  const totalMinutes = differenceInMinutes(checkOut, checkIn);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    totalHours: totalMinutes / 60, // 7.5 형태
    formatted: `${hours}시간 ${minutes}분`,
  };
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
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
  const [recentAttendanceRecords, setRecentAttendanceRecords] = useState<
    DashboardRecentAttendanceRecord[]
  >([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(toTimeString(new Date()));
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

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
          recentAttendanceRecords,
        } = res.data as DashboardSummaryResponse;

        setTodayAttendance({
          isCheckedIn,
          isCheckedOut,
          checkInDate,
          checkOutDate,
        });
        setWorkingHoursThisWeek(workingHoursThisWeek);
        setWorkingDaysThisMonth(workingDaysThisMonth);
        setTotalWorkingDaysThisMonth(totalWorkingDaysThisMonth);
        setAverageWorkingHoursThisMonth(averageWorkingHoursThisMonth);
        setRecentAttendanceRecords(recentAttendanceRecords);
      } catch (error) {
        handleApiError(error, '대시보드 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

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

  const recentAttendanceRecordsDisplay = recentAttendanceRecords.map(record => {
    const recordDate = toDateString(record.date, true);
    const workingHours = calculateWorkDuration(record.checkIn, record.checkOut);

    return (
      <div key={recordDate} className="flex items-center justify-between text-sm">
        <span className="font-medium">{recordDate}</span>
        <div className="flex space-x-2 text-muted-foreground">
          <span>{toDateString(record.checkIn)}</span>
          <span>-</span>
          <span>{toDateString(record.checkOut)}</span>
          <Badge variant="outline" className="ml-2">
            {workingHours.formatted}
          </Badge>
        </div>
      </div>
    );
  });

  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);

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
              isLoading={isLoading}
            />
            <DashboardCard
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              title="이번 주 근무시간"
              content={`${workingHoursThisWeek}시간`}
              description="목표: 40시간"
              isLoading={isLoading}
            />
            <DashboardCard
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              title="이번 달 출근일"
              content={`${workingDaysThisMonth}일`}
              description={`총 ${totalWorkingDaysThisMonth}일 중`}
              isLoading={isLoading}
            />
            <DashboardCard
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              title="평균 근무시간"
              content={`${averageWorkingHoursThisMonth.toFixed(1)}시간`}
              description={`일일 평균 (${toDateString(firstDayOfMonth)} ~ ${toDateString(lastDayOfMonth)})`}
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {isLoading ? (
              <>
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </>
            ) : (
              <>
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
                    <div className="space-y-3">{recentAttendanceRecordsDisplay}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
