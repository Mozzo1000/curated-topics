# Tests

Playwright end-to-end tests live in `tests/e2e/`:

- `smoke.spec.js` — functional coverage (search, collection tabs, domain filter, view modes, keyboard navigation, theme persistence, `/admin`).
- `visual.spec.js` — screenshot diffs for List/Grid/Compact views in light and dark mode, the settings drawer, and a mobile viewport. Baselines are committed under `tests/e2e/visual.spec.js-snapshots/`.

Run locally with `npm run test:e2e` (builds the site and serves it via `vite preview` automatically — see the root `DEPENDENCY_UPDATES.md` for the full command reference).

**On Windows/macOS**, screenshot baselines won't match natively since they're OS-specific and CI runs on Ubuntu. Use `npm run test:e2e:smoke` for fast functional-only iteration, and `npm run test:e2e:win` to run everything (including visuals) inside a Docker container matching CI before you push — see `DEPENDENCY_UPDATES.md` for details.

If a change intentionally alters the UI, regenerate the visual baselines and **look at the new screenshots before committing them**:

```
npx playwright test --update-snapshots
```
