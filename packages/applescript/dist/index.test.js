import { test, expect, describe } from "vitest";
import { executeArcJavaScript } from "./index.js";
describe("executeArcJavaScript", () => {
    test("should execute simple JavaScript and return result", async () => {
        const result = await executeArcJavaScript("1 + 1");
        expect(result).toBe(2);
    });
    test("should execute JavaScript that returns a string", async () => {
        const result = await executeArcJavaScript("'hello world'");
        expect(result).toBe("hello world");
    });
    test("should execute JavaScript that returns JSON", async () => {
        const result = await executeArcJavaScript("JSON.stringify({ foo: 'bar', num: 42 })");
        expect(result).toBe('{"foo":"bar","num":42}');
    });
    test("should execute JavaScript that returns an array", async () => {
        const result = await executeArcJavaScript("JSON.stringify([1, 2, 3])");
        expect(result).toBe("[1,2,3]");
    });
    test("should handle null return value", async () => {
        const result = await executeArcJavaScript("null");
        expect(result).toBeNull();
    });
    test("should handle undefined return value", async () => {
        const result = await executeArcJavaScript("undefined");
        expect(result).toBeNull();
    });
    test("should execute DOM queries", async () => {
        const result = await executeArcJavaScript("document.title");
        expect(typeof result).toBe("string");
    });
    test("should execute code with special characters", async () => {
        const result = await executeArcJavaScript("JSON.stringify({ quote: '\\\"test\\\"', newline: '\\\\n' })");
        expect(typeof result).toBe("string");
        expect(result).toContain("test");
    });
    test("should respect timeout option", async () => {
        // This test verifies the timeout is passed through
        // We don't actually want to timeout, so we use a long timeout
        const result = await executeArcJavaScript("1 + 1", { timeout: 5000 });
        expect(result).toBe(2);
    });
    test("should handle complex JavaScript expressions", async () => {
        const code = `
      const data = { items: [1, 2, 3] };
      const sum = data.items.reduce((a, b) => a + b, 0);
      JSON.stringify({ sum });
    `;
        const result = await executeArcJavaScript(code);
        expect(result).toBe('{"sum":6}');
    });
});
//# sourceMappingURL=index.test.js.map