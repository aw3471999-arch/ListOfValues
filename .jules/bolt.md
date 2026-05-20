## 2026-05-20 - LOV Data Caching Pattern
**Learning:** List of Values (LOV) are frequently accessed but rarely changed during a session. Implementing caching in the service layer using `shareReplay(1)` significantly reduces redundant network requests and improves perceived performance. Caching should be invalidated on mutations (add/delete) and logout.
**Action:** Always implement caching for semi-static reference data. Ensure cache invalidation is handled in mutation methods.

## 2026-05-20 - Angular 21 Testing Considerations
**Learning:** In Angular 21 zoneless mode, component properties accessed in unit tests must be `public`. Additionally, required inputs must be explicitly set using `fixture.componentRef.setInput()` before the first change detection cycle to avoid `NG0950` errors.
**Action:** Mark properties used in tests as `public`. Use `setInput` for required inputs in test setup.
