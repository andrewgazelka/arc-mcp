import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run tests serially since they interact with Arc browser
    sequence: {
      concurrent: false,
    },
    // Reasonable timeout for browser automation
    testTimeout: 30000,
    hookTimeout: 30000,
    // Only run tests if Arc is available (macOS)
    globals: true,
    // Don't retry failed tests
    retry: 0,
    // Bail on first failure to avoid hanging
    bail: 1,
    // Allow tests to pass when all are skipped (CI without Arc)
    passWithNoTests: true,
  },
});
