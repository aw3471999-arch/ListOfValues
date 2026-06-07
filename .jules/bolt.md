## 2026-06-07 - API Caching for Static Data
**Learning:** In applications managing "List of Values" or categories, data is relatively static but frequently accessed during navigation. Implementing client-side caching in the service layer significantly reduces redundant network overhead and improves perceived latency.
**Action:** Use `shareReplay(1)` in Angular services for semi-static data and ensure clear invalidation paths on mutation or session end.
