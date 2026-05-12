## 2026-05-12 - [Service-Level API Caching]
**Learning:** In applications where multiple standalone components subscribe to the same semi-static data (like categories or LOVs) through a shared service, redundant API calls occur because each subscription triggers a new request in the .
**Action:** Use `shareReplay(1)` in the service to cache the observable and return it to all subscribers, ensuring a single network request per session or until invalidated (e.g., on logout).
## 2026-05-12 - [Service-Level API Caching]
**Learning:** In applications where multiple standalone components subscribe to the same semi-static data (like categories or LOVs) through a shared service, redundant API calls occur because each subscription triggers a new request in the `HttpClient`.
**Action:** Use `shareReplay(1)` in the service to cache the observable and return it to all subscribers, ensuring a single network request per session or until invalidated (e.g., on logout).
