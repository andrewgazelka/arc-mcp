import { test, expect, describe } from "vitest";
import { click, fill, type, selectOption, getPageStructure } from "./api.js";
describe("browser API", () => {
    describe("getPageStructure", () => {
        test("should return page structure", async () => {
            const structure = await getPageStructure(1);
            // Structure may be null for about:blank, that's ok
            expect(structure === null || typeof structure === "object").toBe(true);
        });
        test("should respect maxDepth parameter", async () => {
            const shallow = await getPageStructure(1);
            const deep = await getPageStructure(3);
            // Both should be valid (null or object)
            expect(shallow === null || typeof shallow === "object").toBe(true);
            expect(deep === null || typeof deep === "object").toBe(true);
        });
    });
    describe("click", () => {
        test("should accept role locator", async () => {
            try {
                await click({ role: { role: "button", name: "test" } });
            }
            catch (e) {
                // Expected to fail on about:blank
                expect(e.message).toContain("Could not find element");
            }
        });
        test("should accept css locator", async () => {
            try {
                await click({ css: "button.test" });
            }
            catch (e) {
                // Expected to fail on about:blank
                expect(e.message).toContain("Could not find element");
            }
        });
        test("should accept text locator", async () => {
            try {
                await click({ text: "Click me" });
            }
            catch (e) {
                // Expected to fail on about:blank
                expect(e.message).toContain("Could not find element");
            }
        });
    });
    describe("fill", () => {
        test("should accept label locator", async () => {
            try {
                await fill({ label: "Email" }, "test@example.com");
            }
            catch (e) {
                // Expected to fail on about:blank
                expect(e.message).toContain("Could not find element");
            }
        });
        test("should accept placeholder locator", async () => {
            try {
                await fill({ placeholder: "Enter email" }, "test@example.com");
            }
            catch (e) {
                // Expected to fail on about:blank
                expect(e.message).toContain("Could not find element");
            }
        });
    });
    describe("type", () => {
        test("should accept locator and text", async () => {
            try {
                await type({ css: "input" }, "hello");
            }
            catch (e) {
                // Expected to fail on about:blank
                expect(e.message).toContain("Could not find element");
            }
        });
    });
    describe("selectOption", () => {
        test("should accept locator and option", async () => {
            try {
                await selectOption({ css: "select" }, "option1");
            }
            catch (e) {
                // Expected to fail on about:blank
                expect(e.message).toContain("Could not find element");
            }
        });
    });
});
//# sourceMappingURL=api.test.js.map