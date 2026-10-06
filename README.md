# barber-saas-schedule-app

> schedule bounded context: mobile UI (remote)

Part of the **LMS Library** distributed system — team `lms-library`, Grupo 2.
Governance and documentation live in [`library-docs`](https://github.com/code-corhuila/library-docs).

## Branching

Three permanent branches. **None of them accepts a direct commit** — you enter through a child
branch and leave through a Pull Request.

```
develop  <--PR--  feat/... fix/... chore/...
qa       <--PR--  qa/...
main     <--PR--  release/...  hotfix/...
```

Promotion happens **by re-application** (`git cherry-pick -x`), never by merging one permanent
branch into another: `merge develop -> qa` and `merge qa -> main` do not exist in this model.

`main` requires **1 approval from `ariel5253`**. On `develop` and `qa` the team sets its own review
rule.

Full policy: `00-governance/branching-policy.md` in `library-docs`.

---

## BarberSaaS — what this repository is

The schedule screens of BarberSaaS: an **Ionic React** domain app (ADR-013) mounted by the Angular
shell (`barber-saas-front`) at `/schedule`. It exposes only `./mount` through Native Federation and
shares nothing: it receives the shell's HTTP client and session in the mount context, so it never
creates a client or stores a token itself (norm 5.4.1). Screen ported from the prototype
(`(admin)/schedule/[barberProfileId]`), same dark and gold look, with Ionic components.

| Screen | Who | Calls |
|---|---|---|
| Barbers: pick whose schedule to set | `ADMIN_BARBERSHOP` | `GET /api/v1/barbers` (barbershop-api) |
| Week: days and blocks, split shifts, save the whole week | `ADMIN_BARBERSHOP` edits; a `BARBER` reads their own | `GET` / `PUT /api/v1/barber-schedules/{barberId}` |
| Days off and special hours from today on | `ADMIN_BARBERSHOP` creates and deletes; a `BARBER` reads their own | `/api/v1/schedule-exceptions` |

```
src/mount.tsx                 ./mount(element, context) — what the shell calls
src/shell-contract.ts         the types of the contract with the shell (copied, never imported)
src/schedule/                 typed calls through context.api, the week editor, the exception form
src/navigation/routes.ts      the routes inside /schedule and the barber's own profile
src/pages/                    BarbersPage, WeekPage, ExceptionsPage, ExceptionForm
src/ui/                       the four states of every view, fields, styles (prefix sc-)
```

A day without blocks is a day off; a day may hold several blocks (split shift), which the
prototype did not allow. The editor shows, per day, what the service would reject (a bad time, an
end before the start, overlapping blocks) before saving. An exception replaces the weekly
schedule that day.

### How to start it

```bash
npm ci
npm start      # builds and serves dist/schedule at http://localhost:4303 (CORS on)
```

Then start the shell (`npm start` in `barber-saas-front`) and the platform (`./scripts/up.sh dev`
in `barber-saas-infra-postgres`), and open `/schedule`.

### Where the data is

Nowhere in this app: the week and the exceptions live in the `schedule` schema (`schedule-api`),
the barbers in `barbershop`, the session in the shell.

### How it is tested

`npm test` (Vitest): the calls to the API, the week editor and its checks, the exception form, the
routes and the error messages. CI also checks the types and builds the remote.

### What is missing

- **Availability for clients** is shown by the booking screen of `appointment-app`, which calls
  `GET /api/v1/availability`; it needs OQ-07 closed for client tokens.
- A barber without a profile sees no schedule until the owner creates it in Barberías › Barberos.
