import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run tests serially since they interact with the browser
    sequence: {
      concurrent: false,
    },
    // Run test FILES serially (not in parallel)
    fileParallelism: false,
    // Reasonable timeout for browser automation
    testTimeout: 30000,
    hookTimeout: 30000,
    // Only run tests if browser is available (macOS)
    globals: true,
    // Don't retry failed tests
    retry: 0,
    // Bail on first failure to avoid hanging
    bail: 1,
    // Allow tests to pass when all are skipped (CI without browser)
    passWithNoTests: true,
  },
});
