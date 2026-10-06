import { useEffect, useState } from 'react';
import { IonButton, IonSpinner } from '@ionic/react';
import { getWeek, setWeek } from '../schedule/schedule-api';
import { addBlock, DAYS, editorFrom, removeBlock, toSlots, updateBlock, validateWeek, type WeekEditor }
  from '../schedule/week-editor';
import type { ApiClient } from '../shell-contract';
import { LoadView } from '../ui/LoadView';
import { TimeInput } from '../ui/TimeInput';
import { messageOf, useLoad } from '../ui/load';

interface WeekPageProps {
  api: ApiClient;
  barberId: string;
  /** The owner edits; a barber only reads their own week (schedule-service.yaml). */
  editable: boolean;
  onBack?(): void;
  onExceptions(): void;
}

/**
 * The prototype's (admin)/schedule/[barberProfileId]: which days the barber works and when. A day
 * without blocks is a day off. Unlike the prototype, a day may hold several blocks (split shift).
 * Saving replaces the whole week (DEC-SCHED-01).
 */
export function WeekPage({ api, barberId, editable, onBack, onExceptions }: WeekPageProps) {
  const [result, reload] = useLoad(() => getWeek(api, barberId), [barberId], 'No se pudo cargar el horario.');
  const [editor, setEditor] = useState<WeekEditor | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (result.state === 'ready') setEditor(editorFrom(result.data));
  }, [result]);

  async function save() {
    if (!editor || pending) return;
    const found = validateWeek(editor);
    setErrors(found);
    setNotice(null);
    if (Object.keys(found).length > 0) return;
    setPending(true);
    try {
      setEditor(editorFrom(await setWeek(api, barberId, toSlots(editor))));
      setNotice({ ok: true, text: 'Horario guardado.' });
    } catch (err) {
      setNotice({ ok: false, text: messageOf(err, 'No se pudo guardar el horario. Inténtalo de nuevo.') });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="sc-page">
      {onBack && <IonButton fill="clear" className="sc-secondary" onClick={onBack}>‹ Barberos</IonButton>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="sc-header">{editable ? 'Configurar horario' : 'Mi horario'}</h1>
        <IonButton fill="outline" size="small" className="sc-secondary" onClick={onExceptions}>Días especiales</IonButton>
      </div>
      <p className="sc-hint">
        {editable ? 'Agrega los bloques en que el barbero trabaja. Un día sin bloques es día libre.'
          : 'Tu semana de trabajo. Si necesitas un cambio, pídelo al administrador de la barbería.'}
      </p>
      <LoadView load={result} onRetry={reload} isEmpty={() => false} empty="">
        {() => editor && (
          <>
            {DAYS.map((name, day) => (
              <div key={day} className="sc-card" style={{ display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="sc-title">{name}</p>
                  {editable && (
                    <IonButton size="small" fill="clear" className="sc-secondary"
                               onClick={() => setEditor(addBlock(editor, day))}>+ bloque</IonButton>
                  )}
                </div>
                {editor[day].length === 0 && <p className="sc-muted">Día libre</p>}
                {editor[day].map((block, index) => (
                  <div key={index} style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginTop: '.4rem' }}>
                    {editable ? (
                      <>
                        <div className="sc-field" style={{ flex: 1, marginBottom: 0 }}>
                          <TimeInput ariaLabel={`${name}, inicio del bloque ${index + 1}`} value={block.startTime}
                                     onChange={(startTime) => setEditor(updateBlock(editor, day, index, { startTime }))} />
                        </div>
                        <span className="sc-muted">a</span>
                        <div className="sc-field" style={{ flex: 1, marginBottom: 0 }}>
                          <TimeInput ariaLabel={`${name}, fin del bloque ${index + 1}`} value={block.endTime}
                                     onChange={(endTime) => setEditor(updateBlock(editor, day, index, { endTime }))} />
                        </div>
                        <button type="button" className="sc-remove" aria-label={`Quitar bloque ${index + 1} del ${name}`}
                                onClick={() => setEditor(removeBlock(editor, day, index))}>×</button>
                      </>
                    ) : (
                      <span className="sc-chip">{block.startTime} – {block.endTime}</span>
                    )}
                  </div>
                ))}
                {errors[day] && <div className="sc-field-error" role="alert">{errors[day]}</div>}
              </div>
            ))}
            {notice && <div className={notice.ok ? 'sc-ok' : 'sc-alert'} role="status">{notice.text}</div>}
            {editable && (
              <div className="sc-footer">
                <IonButton expand="block" className="sc-primary" disabled={pending} onClick={save}>
                  {pending ? <IonSpinner name="crescent" aria-label="Guardando" /> : 'Guardar horario'}
                </IonButton>
              </div>
            )}
          </>
        )}
      </LoadView>
    </section>
  );
}
