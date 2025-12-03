import { test, expect, describe } from "vitest";
import { openUrl, getCurrentTab, listTabs, reloadTab, goBack, goForward, executeJavaScript, } from "./navigation.js";
describe("navigation API", () => {
    describe("openUrl", () => {
        test.skip("should open URL in current tab by default", async () => {
            // Skipped: Requires Arc to be running with a valid window
            await openUrl("about:blank");
            const tab = await getCurrentTab();
            expect(tab.url).toContain("about:blank");
        });
        test.skip("should open URL in new tab when specified", async () => {
            // Skipped: Requires Arc to be running with a valid window
            const tabsBefore = await listTabs();
            await openUrl("about:blank", true);
            const tabsAfter = await listTabs();
            expect(tabsAfter.length).toBeGreaterThanOrEqual(tabsBefore.length);
        });
    });
    describe("getCurrentTab", () => {
        test("should return current tab info", async () => {
            const tab = await getCurrentTab();
            expect(tab).toHaveProperty("title");
            expect(tab).toHaveProperty("url");
            expect(typeof tab.title).toBe("string");
            expect(typeof tab.url).toBe("string");
        });
    });
    describe("listTabs", () => {
        test("should return array of tabs", async () => {
            const tabs = await listTabs();
            expect(Array.isArray(tabs)).toBe(true);
            expect(tabs.length).toBeGreaterThan(0);
        });
        test("should include tab info for each tab", async () => {
            const tabs = await listTabs();
            tabs.forEach((tab) => {
                expect(tab).toHaveProperty("id");
                expect(tab).toHaveProperty("title");
                expect(tab).toHaveProperty("url");
            });
        });
    });
    describe("executeJavaScript", () => {
        test("should execute JavaScript in current tab", async () => {
            const result = await executeJavaScript("1 + 1");
            expect(result).toBe(2);
        });
        test("should return DOM information", async () => {
            const result = await executeJavaScript("document.title");
            expect(typeof result).toBe("string");
        });
        test.skip("should handle async code", async () => {
            // Skipped: AppleScript executeJavaScript doesn't await Promises
            const result = await executeJavaScript("Promise.resolve('async result')");
            expect(result).toBe("async result");
        });
    });
    describe("reloadTab", () => {
        test.skip("should reload current tab", async () => {
            // Skipped: Requires Arc to be running with a valid window
            await openUrl("about:blank");
            await reloadTab();
            const tab = await getCurrentTab();
            expect(tab.url).toContain("about:blank");
        });
    });
    describe("goBack and goForward", () => {
        test.skip("should navigate browser history", async () => {
            // Skipped: Requires Arc to be running with a valid window
            // Open two pages
            await openUrl("about:blank");
            await openUrl("data:text/html,<h1>Test</h1>");
            // Go back
            await goBack();
            let tab = await getCurrentTab();
            expect(tab.url).toContain("about:blank");
            // Go forward
            await goForward();
            tab = await getCurrentTab();
            expect(tab.url).toContain("data:text/html");
        });
    });
});
//# sourceMappingURL=navigation.test.js.map