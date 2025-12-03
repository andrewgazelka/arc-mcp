import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run tests serially since they interact with Arc browser
    sequence: {
      concurrent: false,
    },
    // Reasonable timeout for browser automation
    testTimeout: 10000,
    hookTimeout: 10000,
    // Only run tests if Arc is available (macOS)
    globals: true,
    // Don't retry failed tests
    retry: 0,
    // Bail on first failure to avoid hanging
    bail: 1,
  },
});
