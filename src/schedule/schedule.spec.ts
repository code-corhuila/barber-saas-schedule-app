import { describe, expect, it } from 'vitest';
import type { ApiClient } from '../shell-contract';
import * as api from './schedule-api';
import { addBlock, DAYS, editorFrom, removeBlock, toSlots, validateWeek } from './week-editor';
import { validateException } from './exception-form';

function recordingApi(calls: unknown[][]): ApiClient {
  const record = (...args: unknown[]) => { calls.push(args); return Promise.resolve({} as never); };
  return { get: record, post: record, put: record, patch: record, delete: record } as ApiClient;
}

describe('schedule-api', () => {
  it('reads and replaces a week, and manages exceptions, only through the shell client', async () => {
    const calls: unknown[][] = [];
    const client = recordingApi(calls);

    await api.listBarbers(client);
    await api.getWeek(client, 'b1');
    await api.setWeek(client, 'b1', [{ dayOfWeek: 1, startTime: '08:00', endTime: '12:00' }]);
    await api.listExceptions(client, { barberId: 'b1', from: '2026-10-01' });
    await api.createException(client, { barberId: 'b1', exceptionDate: '2026-10-12', isDayOff: true, reason: ' ' },
      'key-000000001');
    await api.createException(client, { barberId: 'b1', exceptionDate: '2026-10-15', isDayOff: false,
      startTime: '13:00', endTime: '18:00', reason: ' Médico ' }, 'key-000000002');
    await api.deleteException(client, 'e1');

    expect(calls).toEqual([
      ['/api/v1/barbers?limit=100'],
      ['/api/v1/barber-schedules/b1'],
      ['/api/v1/barber-schedules/b1', { slots: [{ dayOfWeek: 1, startTime: '08:00', endTime: '12:00' }] }],
      ['/api/v1/schedule-exceptions?barberId=b1&from=2026-10-01&limit=100'],
      ['/api/v1/schedule-exceptions', { barberId: 'b1', exceptionDate: '2026-10-12', isDayOff: true },
        { idempotencyKey: 'key-000000001' }],
      ['/api/v1/schedule-exceptions', { barberId: 'b1', exceptionDate: '2026-10-15', isDayOff: false,
        startTime: '13:00', endTime: '18:00', reason: 'Médico' }, { idempotencyKey: 'key-000000002' }],
      ['/api/v1/schedule-exceptions/e1'],
    ]);
  });
});

describe('week editor', () => {
  it('lists the days from Sunday, as day_of_week does', () => {
    expect(DAYS[0]).toBe('Domingo');
    expect(DAYS[1]).toBe('Lunes');
    expect(DAYS[6]).toBe('Sábado');
  });

  it('turns the saved week into blocks per day and back, keeping a split shift', () => {
    const editor = editorFrom({ barberProfileId: 'b1', slots: [
      { id: '1', barberProfileId: 'b1', dayOfWeek: 1, startTime: '14:00', endTime: '19:00', isActive: true },
      { id: '2', barberProfileId: 'b1', dayOfWeek: 1, startTime: '08:00', endTime: '12:00', isActive: true },
    ] });

    expect(editor[1]).toEqual([{ startTime: '08:00', endTime: '12:00' }, { startTime: '14:00', endTime: '19:00' }]);
    expect(editor[2]).toEqual([]);
    expect(toSlots(editor)).toEqual([
      { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' }, { dayOfWeek: 1, startTime: '14:00', endTime: '19:00' },
    ]);
  });

  it('adds a block after the last one of the day and removes it again', () => {
    const empty = editorFrom({ barberProfileId: 'b1', slots: [] });
    const one = addBlock(empty, 3);
    const two = addBlock(one, 3);

    expect(one[3]).toEqual([{ startTime: '08:00', endTime: '12:00' }]);
    expect(two[3][1]).toEqual({ startTime: '14:00', endTime: '18:00' });
    expect(removeBlock(two, 3, 0)[3]).toEqual([{ startTime: '14:00', endTime: '18:00' }]);
  });

  it('explains in Spanish a bad time, an end before the start and two blocks that overlap', () => {
    const editor = { ...editorFrom({ barberProfileId: 'b1', slots: [] }),
      1: [{ startTime: '08:00', endTime: '12:00' }, { startTime: '11:00', endTime: '15:00' }],
      2: [{ startTime: '8', endTime: '12:00' }],
      3: [{ startTime: '12:00', endTime: '12:00' }] };

    expect(validateWeek(editor)).toEqual({
      1: 'Los bloques 08:00–12:00 y 11:00–15:00 del lunes se cruzan.',
      2: 'Escribe las horas como HH:mm, por ejemplo 08:00.',
      3: 'La hora de fin debe ser posterior a la de inicio.',
    });
    expect(validateWeek(editorFrom({ barberProfileId: 'b1', slots: [] }))).toEqual({});
  });
});

describe('exception form', () => {
  it('accepts a day off or special hours with both times', () => {
    expect(validateException({ date: '2026-10-12', dayOff: true, startTime: '', endTime: '', reason: '' }).errors)
      .toEqual({});
    expect(validateException({ date: '2026-10-15', dayOff: false, startTime: '13:00', endTime: '18:00', reason: '' })
      .errors).toEqual({});
  });

  it('asks for what the contract needs', () => {
    expect(validateException({ date: '12/10/2026', dayOff: false, startTime: '', endTime: '10:00',
      reason: 'r'.repeat(151) }).errors).toEqual({
      date: 'Elige la fecha.',
      startTime: 'Escribe la hora de inicio como HH:mm.',
      reason: 'El motivo tiene máximo 150 caracteres.',
    });
    expect(validateException({ date: '2026-10-15', dayOff: false, startTime: '18:00', endTime: '13:00', reason: '' })
      .errors).toEqual({ endTime: 'La hora de fin debe ser posterior a la de inicio.' });
  });
});
