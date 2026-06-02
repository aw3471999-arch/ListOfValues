## 2026-06-02 - API Response Caching in LovService
**Learning:** Implementing client-side caching using RxJS `shareReplay(1)` for semi-static data like categories and list of values significantly reduces redundant HTTP POST requests. It's crucial to implement a `clearCache` mechanism triggered by data mutations (Add/Delete) and user logout to ensure data consistency.
**Action:** Always consider `shareReplay(1)` for data that doesn't change frequently within a session, and ensure proper invalidation on mutation.
