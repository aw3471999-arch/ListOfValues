## 2025-05-14 - [LovService Caching]
**Learning:** API calls for LOV data were redundant as they were called every time a category was selected or the dashboard was initialized. Implementing a simple caching layer using `shareReplay(1)` and a `Map` significantly reduces network overhead.
**Action:** Always check for frequently requested semi-static data that can be cached at the service level.
