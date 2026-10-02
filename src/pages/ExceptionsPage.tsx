import { useState } from 'react';
import { IonButton } from '@ionic/react';
import { deleteException, listExceptions } from '../schedule/schedule-api';
import type { ScheduleException } from '../schedule/types';
import type { ApiClient } from '../shell-contract';
import { LoadView } from '../ui/LoadView';
import { messageOf, useLoad } from '../ui/load';
import { ExceptionForm } from './ExceptionForm';

interface ExceptionsPageProps {
  api: ApiClient;
  /** The owner's chosen barber; a barber gets their own exceptions, whatever is sent (the service forces it). */
  barberId: string;
  editable: boolean;
  onBack(): void;
}

function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function label(e: ScheduleException): string {
  return e.isDayOff ? 'Día libre' : `Horario especial ${e.startTime} – ${e.endTime}`;
}

/** Days off and special hours from today on. Only the owner registers or deletes them. */
export function ExceptionsPage({ api, barberId, editable, onBack }: ExceptionsPageProps) {
  const [result, reload] = useLoad(() => listExceptions(api, { barberId, from: today() }), [barberId],
    'No se pudieron cargar los días especiales.');
  const [creating, setCreating] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  async function remove(e: ScheduleException) {
    setFailure(null);
    try {
      await deleteException(api, e.id);
      reload();
    } catch (err) {
      setFailure(messageOf(err, 'No se pudo eliminar el día especial.'));
    }
  }

  return (
    <section className="sc-page">
      <IonButton fill="clear" className="sc-secondary" onClick={onBack}>‹ Horario semanal</IonButton>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="sc-header">Días especiales</h1>
        {editable && <IonButton className="sc-primary" onClick={() => setCreating(true)}>+ Nuevo</IonButton>}
      </div>
      <p className="sc-hint">Un día especial reemplaza el horario semanal en esa fecha.</p>
      {failure && <div className="sc-alert" role="alert">{failure}</div>}
      <LoadView load={result} onRetry={reload} isEmpty={(page) => page.data.length === 0}
                empty="No hay días especiales próximos.">
        {(page) => page.data.map((e) => (
          <div key={e.id} className="sc-card">
            <span className="sc-grow">
              <p className="sc-title">{e.exceptionDate}</p>
              <p className="sc-gold">{label(e)}</p>
              {e.reason && <p className="sc-muted">{e.reason}</p>}
            </span>
            {editable && (
              <IonButton size="small" fill="clear" className="sc-secondary" aria-label={`Eliminar ${e.exceptionDate}`}
                         onClick={() => remove(e)}>Eliminar</IonButton>
            )}
          </div>
        ))}
      </LoadView>
      {creating && (
        <ExceptionForm api={api} barberId={barberId} onClose={() => setCreating(false)}
                       onSaved={() => { setCreating(false); reload(); }} />
      )}
    </section>
  );
}
