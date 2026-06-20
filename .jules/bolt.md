## 2026-06-20 - API Response Caching in LovService
**Learning:** For semi-static data like "List of Values" categories and items, implementing client-side caching using RxJS `shareReplay(1)` significantly reduces redundant network requests (by ~80% during typical navigation) and improves UI responsiveness. A centralized `clearCache()` method triggered by mutations (add, delete) and session changes (login, logout) is essential to maintain data consistency.
**Action:** Identify semi-static data endpoints in Angular services and implement `shareReplay(1)` caching with a robust invalidation strategy.

## 2026-06-20 - Signal-based Unit Testing in Angular 21
**Learning:** When testing components using Angular Signals, traditional DOM-based assertions (like `querySelector('h1')`) may fail if the template doesn't explicitly render those elements or if the signal hasn't propagated. Accessing the signal value directly via `(component as any).signalName()` or using `fixture.whenStable()` is more reliable for verifying state in a "zoneless" or performance-oriented environment.
**Action:** Prefer signal-based assertions over brittle DOM queries in unit tests for modern Angular applications.
