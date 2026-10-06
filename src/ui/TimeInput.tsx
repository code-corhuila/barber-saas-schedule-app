import { IonInput } from '@ionic/react';
import { typeTime } from '../schedule/time-input';

interface TimeInputProps {
  value: string;
  label?: string;
  ariaLabel?: string;
  onChange(value: string): void;
}

/** A time typed as HH:mm on a 24-hour clock, whatever the phone's language (see typeTime). */
export function TimeInput({ value, label, ariaLabel, onChange }: TimeInputProps) {
  return (
    <IonInput value={value} label={label} labelPlacement={label ? 'stacked' : undefined} aria-label={ariaLabel}
              inputmode="numeric" maxlength={5} placeholder="08:00"
              onIonInput={(e) => {
                const typed = typeTime(String(e.detail.value ?? ''));
                // Write it back at once: a dropped letter leaves the state as it was, with no re-render.
                e.target.value = typed;
                onChange(typed);
              }} />
  );
}
