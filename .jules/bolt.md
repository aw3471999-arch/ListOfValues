
## 2026-06-04 - API Caching and Search Optimization
**Learning:** Semi-static data like 'List of Values' and categories are frequently re-fetched across component lifecycles. Implementing RxJS-based caching in the service layer significantly reduces network overhead. Debouncing search inputs on signals/observables prevents redundant filtering computations.
**Action:** Always check for repeat API calls for static/semi-static data and implement caching with 'shareReplay(1)'. Ensure cache invalidation on data mutation.
