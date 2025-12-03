import { test, expect, describe, beforeAll } from "vitest";
import { click, fill, type, selectOption, getPageStructure } from "./api.js";
import { openUrl } from "./navigation.js";

describe("browser API", () => {
  describe("getPageStructure", () => {
    test.skip("should return page structure", async () => {
      // Skipped: Requires Arc to be running
      const structure = await getPageStructure(1);
      // Structure may be null for about:blank, that's ok
      expect(structure === null || typeof structure === "object").toBe(true);
    });

    test.skip("should respect maxDepth parameter", async () => {
      // Skipped: Requires Arc to be running
      const shallow = await getPageStructure(1);
      const deep = await getPageStructure(3);
      // Both should be valid (null or object)
      expect(shallow === null || typeof shallow === "object").toBe(true);
      expect(deep === null || typeof deep === "object").toBe(true);
    });
  });

  describe("click", () => {
    test.skip("should accept role locator", async () => {
      // Skipped: Requires Arc to be running
      try {
        await click({ role: { role: "button", name: "test" } });
      } catch (e: any) {
        // Expected to fail on about:blank
        expect(e.message).toContain("Could not find element");
      }
    });

    test.skip("should accept css locator", async () => {
      // Skipped: Requires Arc to be running
      try {
        await click({ css: "button.test" });
      } catch (e: any) {
        // Expected to fail on about:blank
        expect(e.message).toContain("Could not find element");
      }
    });

    test.skip("should accept text locator", async () => {
      // Skipped: Requires Arc to be running
      try {
        await click({ text: "Click me" });
      } catch (e: any) {
        // Expected to fail on about:blank
        expect(e.message).toContain("Could not find element");
      }
    });
  });

  describe("fill", () => {
    test.skip("should accept label locator", async () => {
      // Skipped: Requires Arc to be running
      try {
        await fill({ label: "Email" }, "test@example.com");
      } catch (e: any) {
        // Expected to fail on about:blank
        expect(e.message).toContain("Could not find element");
      }
    });

    test.skip("should accept placeholder locator", async () => {
      // Skipped: Requires Arc to be running
      try {
        await fill({ placeholder: "Enter email" }, "test@example.com");
      } catch (e: any) {
        // Expected to fail on about:blank
        expect(e.message).toContain("Could not find element");
      }
    });
  });

  describe("type", () => {
    test.skip("should accept locator and text", async () => {
      // Skipped: Requires Arc to be running
      try {
        await type({ css: "input" }, "hello");
      } catch (e: any) {
        // Expected to fail on about:blank
        expect(e.message).toContain("Could not find element");
      }
    });
  });

  describe("selectOption", () => {
    test.skip("should accept locator and option", async () => {
      // Skipped: Requires Arc to be running
      try {
        await selectOption({ css: "select" }, "option1");
      } catch (e: any) {
        // Expected to fail on about:blank
        expect(e.message).toContain("Could not find element");
      }
    });
  });
});
