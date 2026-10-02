/**
 * The screens of the domain, under the shell's basePath (/schedule). The owner starts on the list of
 * barbers; a barber goes straight to their own week, found by their user id.
 */
export type Route =
  | { name: 'barbers' }
  | { name: 'week'; barberId: string }
  | { name: 'exceptions'; barberId: string };

const PATH = /^\/([0-9a-fA-F-]{36})(\/exceptions)?\/?$/;

export function parseRoute(path: string): Route {
  const match = PATH.exec(path);
  if (!match) return { name: 'barbers' };
  return match[2] ? { name: 'exceptions', barberId: match[1] } : { name: 'week', barberId: match[1] };
}

export function routePath(route: Route): string {
  switch (route.name) {
    case 'week': return `/${route.barberId}`;
    case 'exceptions': return `/${route.barberId}/exceptions`;
    default: return '/';
  }
}

/** The profile of the signed-in barber; a barber without a profile has no schedule yet. */
export function ownBarber(barbers: { id: string; userId: string }[], userId: string): string | null {
  return barbers.find((b) => b.userId === userId)?.id ?? null;
}
