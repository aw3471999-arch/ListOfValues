## 2026-06-09 - LovService API Caching
**Learning:** Implementing API response caching in LovService using `shareReplay(1)` significantly reduces redundant network requests for semi-static data like categories and LOV items. This is crucial for a smooth user experience in Angular applications where users frequently toggle between different views of the same data.
**Action:** Always consider `shareReplay(1)` for caching GET-like POST requests for data that doesn't change often but is accessed frequently. Ensure a cache invalidation strategy (like a `clearCache` method) is in place for when data *does* change (add/delete/update).

## 2026-06-09 - Fixing Broken Build and Tests
**Learning:** The project had a non-module file (`src/app/Components/Dashboard/lov-card/lov-card.ts`) and broken unit tests (missing required inputs in `LovDialog`, title mismatch in `App`). These must be resolved to ensure a reliable CI/CD pipeline and to allow verification of new optimizations.
**Action:** Before implementing optimizations, ensure the baseline build and tests are passing. Remove obsolete files and fix spec files as needed.
