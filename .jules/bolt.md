# Bolt Journal - Critical Performance Learnings

## 2026-06-03 - API Caching and Search Debouncing
**Learning:** Semi-static data like 'List of Values' (LOV) and categories were being fetched repeatedly. Implementing `shareReplay(1)` in the service layer effectively caches these responses. Additionally, the category search was missing debouncing, causing filtering on every keystroke.
**Action:** Use `shareReplay(1)` for idempotent GET/POST requests that return semi-static data. Always debounce search inputs that trigger filtering or API calls.
