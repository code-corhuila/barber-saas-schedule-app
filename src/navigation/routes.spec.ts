import { describe, expect, it } from 'vitest';
import { ownBarber, parseRoute, routePath } from './routes';

const ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

describe('routes inside /schedule', () => {
  it('reads the path the shell mounted the app with', () => {
    expect(parseRoute('/')).toEqual({ name: 'barbers' });
    expect(parseRoute(`/${ID}`)).toEqual({ name: 'week', barberId: ID });
    expect(parseRoute(`/${ID}/exceptions`)).toEqual({ name: 'exceptions', barberId: ID });
    expect(parseRoute('/nope')).toEqual({ name: 'barbers' });
  });

  it('writes a route back as a path', () => {
    expect(routePath({ name: 'week', barberId: 'b1' })).toBe('/b1');
    expect(routePath({ name: 'exceptions', barberId: 'b1' })).toBe('/b1/exceptions');
    expect(routePath({ name: 'barbers' })).toBe('/');
  });

  it('finds the profile of the barber who is signed in', () => {
    const barbers = [{ id: 'p1', userId: 'u1' }, { id: 'p2', userId: 'u2' }];

    expect(ownBarber(barbers, 'u2')).toBe('p2');
    expect(ownBarber(barbers, 'u3')).toBeNull();
  });
});
