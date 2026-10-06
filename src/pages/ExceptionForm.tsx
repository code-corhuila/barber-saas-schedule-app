import { FormEvent, useState } from 'react';
import { IonButton, IonContent, IonInput, IonModal, IonSpinner, IonToggle } from '@ionic/react';
import { validateException, type ExceptionForm as Form } from '../schedule/exception-form';
import { createException } from '../schedule/schedule-api';
import type { ApiClient } from '../shell-contract';
import { Field } from '../ui/Field';
import { TimeInput } from '../ui/TimeInput';
import { messageOf, newIdempotencyKey } from '../ui/load';

interface ExceptionFormProps {
  api: ApiClient;
  barberId: string;
  onClose(): void;
  onSaved(): void;
}

/** A day off or special hours for one date; it replaces the weekly schedule that day (DEC-SCHED-02). */
export function ExceptionForm({ api, barberId, onClose, onSaved }: ExceptionFormProps) {
  const [form, setForm] = useState<Form>({ date: '', dayOff: true, startTime: '', endTime: '', reason: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [key] = useState(newIdempotencyKey);
  const set = (change: Partial<Form>) => setForm((f) => ({ ...f, ...change }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateException(form).errors;
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length > 0 || pending) return;
    setPending(true);
    try {
      await createException(api, { barberId, exceptionDate: form.date, isDayOff: form.dayOff,
        startTime: form.startTime, endTime: form.endTime, reason: form.reason }, key);
      onSaved();
    } catch (err) {
      setFailure(messageOf(err, 'No se pudo guardar el día especial. Inténtalo de nuevo.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <IonModal isOpen className="sc-modal" onDidDismiss={onClose}>
      <IonContent>
        <form className="sc-page sc-root" onSubmit={submit} noValidate>
          <h2 className="sc-header">Nuevo día especial</h2>
          <div className="sc-field">
            <IonInput type="date" label="Fecha" labelPlacement="stacked" value={form.date}
                      aria-invalid={errors.date ? 'true' : 'false'}
                      onIonInput={(e) => set({ date: String(e.detail.value ?? '') })} />
            {errors.date && <div className="sc-field-error">{errors.date}</div>}
          </div>
          <IonToggle checked={form.dayOff} onIonChange={(e) => set({ dayOff: e.detail.checked })}
                     labelPlacement="end" style={{ margin: '.5rem 0 1rem' }}>
            Día libre (sin atención)
          </IonToggle>
          {!form.dayOff && (
            <>
              <div className="sc-field">
                <TimeInput label="Desde" value={form.startTime} onChange={(startTime) => set({ startTime })} />
                {errors.startTime && <div className="sc-field-error">{errors.startTime}</div>}
              </div>
              <div className="sc-field">
                <TimeInput label="Hasta" value={form.endTime} onChange={(endTime) => set({ endTime })} />
                {errors.endTime && <div className="sc-field-error">{errors.endTime}</div>}
              </div>
            </>
          )}
          <Field id="exception-reason" label="Motivo (opcional)" value={form.reason} error={errors.reason}
                 onChange={(reason) => set({ reason })} placeholder="Festivo, cita médica…" />
          <p className="sc-hint">Ese día solo cuenta este horario; la semana normal no se suma.</p>
          {failure && <div className="sc-alert" role="alert">{failure}</div>}
          <IonButton expand="block" type="submit" className="sc-primary" disabled={pending}>
            {pending ? <IonSpinner name="crescent" aria-label="Guardando" /> : 'Guardar'}
          </IonButton>
          <IonButton expand="block" fill="clear" className="sc-secondary" onClick={onClose}>Cancelar</IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
}
