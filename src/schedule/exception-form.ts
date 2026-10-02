import { isTime } from './week-editor';

/** The exception form with the limits of schedule-service.yaml; the service checks the same again. */
export interface ExceptionForm {
  date: string;
  dayOff: boolean;
  startTime: string;
  endTime: string;
  reason: string;
}

export function validateException(form: ExceptionForm): { errors: Partial<Record<keyof ExceptionForm, string>> } {
  const errors: Partial<Record<keyof ExceptionForm, string>> = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) errors.date = 'Elige la fecha.';
  if (!form.dayOff) {
    if (!isTime(form.startTime)) errors.startTime = 'Escribe la hora de inicio como HH:mm.';
    if (!isTime(form.endTime)) errors.endTime = 'Escribe la hora de fin como HH:mm.';
    if (!errors.startTime && !errors.endTime && form.endTime <= form.startTime) {
      errors.endTime = 'La hora de fin debe ser posterior a la de inicio.';
    }
  }
  if (form.reason.trim().length > 150) errors.reason = 'El motivo tiene máximo 150 caracteres.';
  return { errors };
}
