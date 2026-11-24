# Cross-Lane Requests from Lane MODAL

## 1. Request to Integrator Lane: Increase Default Vitest Timeout

- **Target File:** `vitest.config.ts`
- **Issue:** Under full 16-thread parallel execution (`pnpm test`), `tests/scroll.test.ts` executes 1,000 randomized layout iterations. On busy CPU multi-core runs, this test can occasionally exceed Vitest's default 5,000ms test timeout (finishing in ~5,500ms). When run with `--test-timeout 15000` or with isolated workers, it consistently passes in ~1.8s.
- **Specification Impact:** Per Rule L4 and L5, Lane MODAL cannot edit `vitest.config.ts`.
- **Proposed Solution:** In `vitest.config.ts`, add `testTimeout: 15000` to the Vitest test configuration:
  ```ts
  export default defineConfig({
    test: {
      testTimeout: 15000,
    },
  });
  ```
