import type { MountContext } from './shell-contract';

/** The schedule domain app. Its screens arrive in the next pull requests. */
export function App({ context }: { context: MountContext }) {
  return (
    <main style={{ padding: '1rem' }}>
      <h1>Horarios</h1>
      <p>{context.basePath}</p>
    </main>
  );
}
