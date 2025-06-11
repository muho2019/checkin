import { parseISO } from 'date-fns';

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

export function toDateString(date?: Date | string, dayOfTheWeek: boolean = false): string {
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

export function toTimeString(date?: Date | string, second: boolean = true) {
  if (!date) return '-';

  const parsed = typeof date === 'string' ? parseISO(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(second && { second: '2-digit' }),
  };
  return parsed.toLocaleTimeString('ko-KR', options);
}
