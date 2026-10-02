import { useCallback, useEffect, useState } from 'react';
import type { MountContext } from './shell-contract';
import { ownBarber, parseRoute, routePath, type Route } from './navigation/routes';
import { listBarbers } from './schedule/schedule-api';
import { BarbersPage } from './pages/BarbersPage';
import { ExceptionsPage } from './pages/ExceptionsPage';
import { WeekPage } from './pages/WeekPage';
import { LoadView } from './ui/LoadView';
import { useLoad } from './ui/load';
import { STYLES } from './ui/styles';

/** The path inside the domain from the browser address, e.g. /schedule/abc → /abc. */
function pathInDomain(basePath: string): string {
  const path = window.location.pathname;
  return path.startsWith(basePath) ? path.slice(basePath.length) || '/' : '/';
}

/** The owner's screens: any barber of their barbershop. */
function OwnerApp({ context }: { context: MountContext }) {
  const [route, setRoute] = useState<Route>(() => parseRoute(context.initialPath));

  const go = useCallback((next: Route) => {
    setRoute(next);
    context.navigate(context.basePath + routePath(next));
  }, [context]);

  // The back button changes the address; the shell keeps this app mounted, so follow it here.
  useEffect(() => {
    const follow = () => setRoute(parseRoute(pathInDomain(context.basePath)));
    window.addEventListener('popstate', follow);
    return () => window.removeEventListener('popstate', follow);
  }, [context.basePath]);

  if (route.name === 'barbers') {
    return <BarbersPage api={context.api} onOpen={(barberId) => go({ name: 'week', barberId })} />;
  }
  if (route.name === 'exceptions') {
    return <ExceptionsPage api={context.api} barberId={route.barberId} editable
                           onBack={() => go({ name: 'week', barberId: route.barberId })} />;
  }
  return <WeekPage api={context.api} barberId={route.barberId} editable onBack={() => go({ name: 'barbers' })}
                   onExceptions={() => go({ name: 'exceptions', barberId: route.barberId })} />;
}

/** A barber reads only their own week, found by their user id among the barbershop's profiles. */
function BarberApp({ context, userId }: { context: MountContext; userId: string }) {
  const [view, setView] = useState<'week' | 'exceptions'>('week');
  const [own, reload] = useLoad(async () => ownBarber((await listBarbers(context.api)).data, userId), [userId],
    'No se pudo cargar tu perfil de barbero.');
  return (
    <LoadView load={own} onRetry={reload} isEmpty={(id) => id === null}
              empty="Aún no tienes perfil de barbero. Pide al administrador de la barbería que lo cree.">
      {(barberId) => (view === 'week'
        ? <WeekPage api={context.api} barberId={barberId!} editable={false} onExceptions={() => setView('exceptions')} />
        : <ExceptionsPage api={context.api} barberId={barberId!} editable={false} onBack={() => setView('week')} />)}
    </LoadView>
  );
}

/**
 * The schedule domain app (ADR-013). Everything it requests goes through context.api and it never
 * stores a token: the session is the shell's (norm 5.4.1).
 */
export function App({ context }: { context: MountContext }) {
  const user = context.session.user();
  return (
    <div className="sc-root">
      <style>{STYLES}</style>
      {user?.role === 'BARBER'
        ? <BarberApp context={context} userId={user.id} />
        : <OwnerApp context={context} />}
    </div>
  );
}
