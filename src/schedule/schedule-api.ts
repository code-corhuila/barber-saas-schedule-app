import type { ApiClient } from '../shell-contract';
import type { Barber, NewException, Page, ScheduleException, SlotInput, WeeklySchedule } from './types';

/**
 * Typed calls to schedule-service.yaml, ALWAYS through the shell's client (context.api): never fetch
 * or axios (norm 5.4.1). The barbershop is the token's: no call sends it.
 */

/** The barbers to pick from belong to the barbershop domain: asked to barbershop-api, through the gateway. */
export function listBarbers(api: ApiClient): Promise<Page<Barber>> {
  return api.get<Page<Barber>>('/api/v1/barbers?limit=100');
}

export function getWeek(api: ApiClient, barberId: string): Promise<WeeklySchedule> {
  return api.get<WeeklySchedule>(`/api/v1/barber-schedules/${barberId}`);
}

/** DEC-SCHED-01: the whole week at once; an empty list clears it. */
export function setWeek(api: ApiClient, barberId: string, slots: SlotInput[]): Promise<WeeklySchedule> {
  return api.put<WeeklySchedule>(`/api/v1/barber-schedules/${barberId}`, { slots });
}

export function listExceptions(api: ApiClient, filter: { barberId?: string; from?: string; to?: string }):
    Promise<Page<ScheduleException>> {
  const query = new URLSearchParams();
  if (filter.barberId) query.set('barberId', filter.barberId);
  if (filter.from) query.set('from', filter.from);
  if (filter.to) query.set('to', filter.to);
  query.set('limit', '100');
  return api.get<Page<ScheduleException>>(`/api/v1/schedule-exceptions?${query}`);
}

/** A day off sends no times; special hours send both. An empty reason is left out. */
export function createException(api: ApiClient, e: NewException, idempotencyKey: string): Promise<ScheduleException> {
  const reason = e.reason.trim();
  return api.post<ScheduleException>('/api/v1/schedule-exceptions', {
    barberId: e.barberId,
    exceptionDate: e.exceptionDate,
    isDayOff: e.isDayOff,
    ...(e.isDayOff ? {} : { startTime: e.startTime, endTime: e.endTime }),
    ...(reason ? { reason } : {}),
  }, { idempotencyKey });
}

export function deleteException(api: ApiClient, id: string): Promise<void> {
  return api.delete<void>(`/api/v1/schedule-exceptions/${id}`);
}
