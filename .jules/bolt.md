## 2026-06-11 - API Response Caching in LovService
**Learning:** In a dashboard-heavy application where categories and list-of-values are frequently accessed across different components, redundant API calls can significantly impact perceived performance. Using `shareReplay(1)` provides an elegant way to implement client-side caching while ensuring late subscribers get the latest value.
**Action:** Implement `shareReplay(1)` for semi-static data and ensure a robust `clearCache` mechanism is triggered on data mutations and logout to prevent stale state.

## 2026-06-11 - Verification of Environment and Tests
**Learning:** When entering a repository with pre-existing build or test failures (like missing modules or naming mismatches in specs), it is necessary to fix these blockers before a performance optimization can be verified. These are not "extra" changes but enabling work for the primary task.
**Action:** Thoroughly investigate initial test failures and fix them (e.g., correcting spec imports, removing dead code, providing required inputs in tests) to establish a stable baseline for performance measurement.
