import { barberName } from '../schedule/barber-name';
import { listBarbers } from '../schedule/schedule-api';
import type { ApiClient } from '../shell-contract';
import { LoadView } from '../ui/LoadView';
import { useLoad } from '../ui/load';

/** The owner picks whose schedule to set, among the barbers of their barbershop (barbershop-api). */
export function BarbersPage({ api, onOpen }: { api: ApiClient; onOpen(barberId: string): void }) {
  const [result, reload] = useLoad(() => listBarbers(api), [], 'No se pudieron cargar los barberos.');

  return (
    <section className="sc-page">
      <h1 className="sc-header">Horarios</h1>
      <p className="sc-hint">Elige un barbero para configurar su semana y sus días especiales.</p>
      <LoadView load={result} onRetry={reload} isEmpty={(page) => page.data.length === 0}
                empty="Aún no tienes barberos con perfil. Créalos en Barberías › Barberos.">
        {(page) => page.data.map((barber) => (
          <button key={barber.id} type="button" className="sc-card" onClick={() => onOpen(barber.id)}>
            <span className="sc-logo" aria-hidden="true">✂</span>
            <span className="sc-grow">
              <p className="sc-title">{barberName(barber)}</p>
              <p className="sc-muted">{barber.experienceYears} años de experiencia</p>
              {barber.specialties.length > 0 && (
                <p className="sc-gold">{barber.specialties.map((s) => s.specialtyName).join(' · ')}</p>
              )}
            </span>
          </button>
        ))}
      </LoadView>
    </section>
  );
}
