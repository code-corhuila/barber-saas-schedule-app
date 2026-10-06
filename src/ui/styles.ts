/**
 * The look of the prototype: dark background, cards a shade lighter, gold accent. Scoped to .sc-root
 * with its own prefix, so it never collides with another domain app's styles in the same page.
 */
export const STYLES = `
.sc-root { min-height: 100%; background: #121212; color: #fff; }
.sc-page { max-width: 40rem; margin: 0 auto; padding: 1rem; }
.sc-header { font-size: 1.375rem; font-weight: 700; margin: .5rem 0 .75rem; }
.sc-center { display: grid; place-items: center; gap: .75rem; padding: 3rem 1rem; text-align: center; }
.sc-error { color: #ff6b6b; margin: 0; }
.sc-empty { color: #888; text-align: center; margin-top: 2.5rem; }
.sc-hint { color: #888; font-size: .8rem; margin: -.25rem 0 .75rem; }
.sc-primary { --background: #d4af37; --color: #121212; --border-radius: 10px; font-weight: 700; }
.sc-secondary { --color: #d4af37; --border-color: #d4af37; --border-radius: 10px; }
.sc-search { --background: #1e1e1e; --color: #fff; --placeholder-color: #888; --icon-color: #d4af37; padding: 0 0 .5rem; }
.sc-card { display: flex; gap: .75rem; align-items: center; width: 100%; background: #1e1e1e; border: 1px solid transparent;
  border-radius: 12px; padding: .75rem; margin-bottom: .75rem; color: #fff; text-align: left; cursor: pointer; font: inherit; }
.sc-card.selected { border-color: #d4af37; }
.sc-card.inactive { opacity: .5; }
.sc-logo { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; flex: none; background: #2a2a2a;
  display: grid; place-items: center; color: #d4af37; font-size: 1.5rem; font-weight: 700; }
.sc-grow { flex: 1; min-width: 0; }
.sc-title { font-size: 1rem; font-weight: 600; margin: 0; }
.sc-gold { color: #d4af37; font-size: .8rem; margin: .15rem 0 0; }
.sc-muted { color: #aaa; font-size: .8rem; margin: .15rem 0 0; }
.sc-price { color: #d4af37; font-weight: 700; white-space: nowrap; }
.sc-section { font-size: 1.05rem; font-weight: 700; margin: 1.5rem 0 .75rem; }
.sc-banner { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; }
.sc-chips { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .4rem; }
.sc-chip { background: #2a2a2a; color: #d4af37; border-radius: 999px; padding: .1rem .6rem; font-size: .75rem; }
/* Sticky, not fixed: a fixed bar depends on the containing block the shell gives it, and on the phone
   the cards showed through below it. Sticky stays in the flow at the bottom of the scrolling area. */
.sc-footer { position: sticky; bottom: 0; z-index: 1; margin: 0 -1rem -1rem; padding: .75rem 1rem 1rem;
  background: #121212; border-top: 1px solid #2a2a2a; }
.sc-tabs { --background: #1e1e1e; margin-bottom: .75rem; }
.sc-tabs ion-segment-button { --color: #888; --color-checked: #d4af37; --indicator-color: #d4af37; }
.sc-field { margin-bottom: .75rem; }
.sc-field ion-input, .sc-field ion-textarea { --background: #1e1e1e; --color: #fff; --placeholder-color: #666;
  --border-radius: 10px; --padding-start: 12px; --highlight-color-focused: #d4af37; }
.sc-field-error { color: #ff6b6b; font-size: .8rem; margin-top: .3rem; }
.sc-alert { background: #2a1414; border: 1px solid #ff6b6b; color: #ffb3b3; border-radius: 10px; padding: .75rem;
  margin: .5rem 0; font-size: .875rem; }
.sc-modal { --background: #121212; }
.sc-remove { background: none; border: 0; color: #ff6b6b; font-size: 1.4rem; cursor: pointer; padding: 0 .25rem; }
.sc-ok { background: #142a17; border: 1px solid #4caf50; color: #b9f6c3; border-radius: 10px; padding: .75rem;
  margin: .5rem 0; font-size: .875rem; }
`;
