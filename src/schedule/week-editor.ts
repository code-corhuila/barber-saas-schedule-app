import type { SlotInput, WeeklySchedule } from './types';

/**
 * The week being edited, as plain data: for each day (0 = Sunday … 6 = Saturday, like
 * barber_schedule.day_of_week) its blocks. The prototype allowed one block per day; the contract
 * allows a split shift, so a day holds a list. The checks mirror the service's, so the owner reads
 * the problem before saving; the service checks again (AGGR-INV-BARBER-001).
 */
export const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export interface EditableBlock {
  startTime: string;
  endTime: string;
}

export type WeekEditor = Record<number, EditableBlock[]>;

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isTime(value: string): boolean {
  return HH_MM.test(value);
}

export function editorFrom(week: WeeklySchedule): WeekEditor {
  const editor: WeekEditor = Object.fromEntries(DAYS.map((_, day) => [day, [] as EditableBlock[]]));
  for (const slot of week.slots) {
    editor[slot.dayOfWeek].push({ startTime: slot.startTime, endTime: slot.endTime });
  }
  for (const day of Object.keys(editor)) {
    editor[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  return editor;
}

export function toSlots(editor: WeekEditor): SlotInput[] {
  return DAYS.flatMap((_, day) => editor[day].map((b) => ({ dayOfWeek: day, startTime: b.startTime, endTime: b.endTime })));
}

/** A first block is the morning; another one goes in the afternoon, as a split shift usually does. */
export function addBlock(editor: WeekEditor, day: number): WeekEditor {
  const next = editor[day].length === 0 ? { startTime: '08:00', endTime: '12:00' } : { startTime: '14:00', endTime: '18:00' };
  return { ...editor, [day]: [...editor[day], next] };
}

export function removeBlock(editor: WeekEditor, day: number, index: number): WeekEditor {
  return { ...editor, [day]: editor[day].filter((_, i) => i !== index) };
}

export function updateBlock(editor: WeekEditor, day: number, index: number, change: Partial<EditableBlock>): WeekEditor {
  return { ...editor, [day]: editor[day].map((b, i) => (i === index ? { ...b, ...change } : b)) };
}

/** One message per day with a problem, in Spanish, as the owner reads it. */
export function validateWeek(editor: WeekEditor): Record<number, string> {
  const errors: Record<number, string> = {};
  DAYS.forEach((name, day) => {
    const blocks = editor[day];
    if (blocks.some((b) => !isTime(b.startTime) || !isTime(b.endTime))) {
      errors[day] = 'Escribe las horas como HH:mm, por ejemplo 08:00.';
      return;
    }
    if (blocks.some((b) => b.endTime <= b.startTime)) {
      errors[day] = 'La hora de fin debe ser posterior a la de inicio.';
      return;
    }
    const sorted = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].startTime < sorted[i - 1].endTime) {
        errors[day] = `Los bloques ${sorted[i - 1].startTime}–${sorted[i - 1].endTime} y `
          + `${sorted[i].startTime}–${sorted[i].endTime} del ${name.toLowerCase()} se cruzan.`;
        return;
      }
    }
  });
  return errors;
}
