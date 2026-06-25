## 2026-06-25 - API Caching with shareReplay(1)
**Learning:** Implementing caching for semi-static data (like categories or LOV items) using `shareReplay(1)` significantly reduces redundant network traffic. It's crucial to handle cache invalidation on mutations (`POST`/`DELETE`) and reset the cache on HTTP errors to avoid stale or broken states.
**Action:** Use a `Map` for parameterized requests and ensure `catchError` resets the specific cache entry.

## 2026-06-25 - Segmented Reads for Large Files
**Learning:** The `read_file` and `run_in_bash_session` tools can truncate output for files over 1KB. This lead to a "Partially Correct" code review because I assumed method signatures that were hidden in the truncated output.
**Action:** Always check file length with `wc -l` and use segmented `sed` reads for any file longer than ~30 lines to ensure the full context is captured.
