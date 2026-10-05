/**
 * The resources of schedule-service.yaml (and the barber of barbershop-service.yaml the screens
 * pick from). They replace the prototype's src/types/schedule.ts: UUID ids, times always HH:mm,
 * and several blocks per day (split shift) instead of one.
 */
export interface Block {
  id: string;
  barberProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface WeeklySchedule {
  barberProfileId: string;
  slots: Block[];
}

export interface SlotInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleException {
  id: string;
  barberProfileId: string;
  exceptionDate: string;
  isDayOff: boolean;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}

export interface NewException {
  barberId: string;
  exceptionDate: string;
  isDayOff: boolean;
  startTime?: string;
  endTime?: string;
  reason: string;
}

/** A barber profile as barbershop-api lists it; only what these screens need. */
export interface Barber {
  id: string;
  userId: string;
  /** The copy barbershop-api keeps from identity-auth (ADR-014); null only for older profiles. */
  fullName: string | null;
  experienceYears: number;
  specialties: { id: string; specialtyName: string }[];
}

export interface Page<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
