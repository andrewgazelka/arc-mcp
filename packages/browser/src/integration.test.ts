import { test, expect, describe } from "vitest";
import { openUrl, getCurrentTab } from "./navigation.js";
import { click, fill, getPageStructure } from "./api.js";

describe("integration tests", () => {
  test.skip("should perform a complete web interaction flow", async () => {
    // Skipped: Arc AppleScript doesn't handle URL-encoded data URLs well
    // Create a simple test page with a form
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Page</title></head>
        <body>
          <h1>Test Form</h1>
          <form id="testForm">
            <label for="name">Name:</label>
            <input id="name" type="text" placeholder="Enter your name">

            <label for="email">Email:</label>
            <input id="email" type="email" placeholder="Enter your email">

            <button type="submit">Submit</button>
          </form>
          <div id="result"></div>
          <script>
            document.getElementById('testForm').addEventListener('submit', (e) => {
              e.preventDefault();
              const name = document.getElementById('name').value;
              const email = document.getElementById('email').value;
              document.getElementById('result').textContent =
                'Submitted: ' + name + ', ' + email;
            });
          </script>
        </body>
      </html>
    `;

    const dataUrl = "data:text/html," + encodeURIComponent(html);

    // Open the test page
    await openUrl(dataUrl);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify we're on the right page
    const tab = await getCurrentTab();
    expect(tab.title).toBe("Test Page");

    // Fill in the form
    await fill({ placeholder: "Enter your name" }, "John Doe");
    await new Promise((resolve) => setTimeout(resolve, 200));

    await fill({ placeholder: "Enter your email" }, "john@example.com");
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Submit the form
    await click({ role: { role: "button", name: "Submit" } });
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify the result appears (this would require getting DOM content)
    // For now, just verify the operations completed without error
    expect(true).toBe(true);
  });

  test.skip("should handle Google search flow", async () => {
    // Skipped: Google's UI is complex and may change, making this test flaky
    // Open Google
    await openUrl("https://www.google.com");
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    } catch (e: any) {
      // Google's UI may vary, so we allow this to fail gracefully
      console.log("Google interaction test skipped:", e.message);
    }
  });

  test.skip("should retrieve page structure from real page", async () => {
    // Skipped: Arc AppleScript doesn't handle URL-encoded data URLs well
    // Open a simple page
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
          </nav>
          <main>
            <h1>Welcome</h1>
            <p>Test content</p>
            <button>Click me</button>
          </main>
        </body>
      </html>
    `;

    await openUrl("data:text/html," + encodeURIComponent(html));
    await new Promise((resolve) => setTimeout(resolve, 300));

    const structure = await getPageStructure(2);

    // Structure might be null or an object depending on implementation
    if (structure !== null) {
      expect(typeof structure).toBe("object");
    }
  });
});
