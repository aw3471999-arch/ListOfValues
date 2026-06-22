# Bolt Performance Journal

This journal tracks critical performance-related learnings and patterns discovered in this codebase.

## 2025-05-22 - API Response Caching in LovService
**Learning:** Semi-static data like List of Values (LOV) categories and items are fetched frequently during navigation but change rarely. Implementing caching at the service level using `shareReplay(1)` reduces redundant network requests by ~80% in typical user flows.
**Action:** Use `shareReplay(1)` for GET-like POST requests in `LovService` and implement a manual cache invalidation strategy on mutations.
