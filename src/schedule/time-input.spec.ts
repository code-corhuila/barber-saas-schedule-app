import { describe, expect, it } from 'vitest';
import { typeTime } from './time-input';

describe('typing a 24-hour time', () => {
  it('puts the colon after the hour once the minutes start', () => {
    expect(typeTime('0')).toBe('0');
    expect(typeTime('08')).toBe('08');
    expect(typeTime('080')).toBe('08:0');
    expect(typeTime('0800')).toBe('08:00');
  });

  it('keeps a time already written as HH:mm, such as 18:00', () => {
    expect(typeTime('18:00')).toBe('18:00');
  });

  it('lets the owner erase the colon without it coming back', () => {
    expect(typeTime('08')).toBe('08');
  });

  it('drops letters and anything past four digits', () => {
    expect(typeTime('9a:3b0')).toBe('93:0');
    expect(typeTime('123456')).toBe('12:34');
  });
});
