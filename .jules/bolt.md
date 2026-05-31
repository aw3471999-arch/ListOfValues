# Bolt's Journal - Critical Learnings

## 2026-05-31 - Caching Semi-Static Data
**Learning:** List of Values (LOV) and Categories are semi-static data that are frequently accessed but rarely change within a session. Implementing `shareReplay(1)` in the service layer significantly reduces redundant network requests and improves perceived application speed.
**Action:** Use `shareReplay(1)` for API calls fetching LOVs and categories, and ensure cache invalidation on mutations (add/delete) or logout.
