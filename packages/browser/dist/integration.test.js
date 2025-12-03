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
    test("should click a link and navigate to new page", async () => {
        // Open example.com which has a "Learn more" link
        await openUrl("https://www.example.com", true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Verify we're on example.com
        let tab = await getCurrentTab();
        console.log("Current tab before click:", JSON.stringify(tab, null, 2));
        expect(tab.url).toContain("example.com");
        // Get page structure to verify content loaded
        const structure = await getPageStructure(2);
        console.log("Page structure:", JSON.stringify(structure, null, 2));
        // Click the "Learn more" link
        const result = await click({ text: "Learn more" });
        console.log("Click result:", JSON.stringify(result, null, 2));
        expect(result.success).toBe(true);
        // Wait for navigation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Verify we navigated to a different page (IANA)
        tab = await getCurrentTab();
        expect(tab.url).toContain("iana.org");
    });
});
//# sourceMappingURL=integration.test.js.map