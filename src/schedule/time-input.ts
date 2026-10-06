/**
 * What a time field shows while the owner types: digits only, with the colon after the hour, so
 * 0800 reads 08:00. A native time input follows the phone's language and may show 6:00 PM; the
 * schedule is always written on a 24-hour clock, as the barber's own view shows it.
 */
export function typeTime(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}
