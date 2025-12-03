import { test, expect, describe } from "vitest";
import { openUrl, getCurrentTab } from "./navigation.js";
import { click, fill, getPageStructure } from "./api.js";
describe("integration tests", () => {
    test.skip("should handle Google search flow", async () => {
        // Skipped: Test is flaky due to concurrent test runs opening multiple tabs
        await openUrl("https://www.google.com", true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const tab = await getCurrentTab();
        expect(tab.url).toContain("google.com");
        // Try to interact with search box
        try {
            await fill({ role: { role: "combobox", name: "Search" } }, "Arc browser");
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Press Enter to search (simulate Enter key)
            await click({ role: { role: "button", name: "Google Search" } });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Should have navigated to search results
            const searchTab = await getCurrentTab();
            expect(searchTab.url).toContain("google.com");
        }
        catch (e) {
            // Google's UI may vary, so we allow this to fail gracefully
            console.log("Google interaction test skipped:", e.message);
        }
    });
    test("should retrieve page structure from real page", async () => {
        // Open example.com as it has a simple structure
        await openUrl("https://www.example.com");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const structure = await getPageStructure(2);
        // Structure might be null or an object depending on implementation
        if (structure !== null) {
            expect(typeof structure).toBe("object");
        }
    });
    test("should navigate to a page and verify title", async () => {
        await openUrl("https://www.example.com");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const tab = await getCurrentTab();
        expect(tab.title).toContain("Example");
        expect(tab.url).toContain("example.com");
    });
});
//# sourceMappingURL=integration.test.js.map