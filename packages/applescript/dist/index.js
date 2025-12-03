import { execSync } from "child_process";
/**
 * Get the browser application name from environment.
 * Defaults to "Arc", can be overridden with BROWSER=chrome
 */
export function getBrowserApp() {
    const browser = process.env.BROWSER?.toLowerCase();
    if (browser === 'chrome') {
        return 'Google Chrome';
    }
    return 'Arc';
}
/**
 * Executes JavaScript code in a browser tab via AppleScript.
 * Supports Arc (default) and Google Chrome via BROWSER env var.
 *
 * @param code - The JavaScript code to execute
 * @param options - Execution options
 * @returns The result of the JavaScript execution
 * @throws Error if the AppleScript execution fails
 */
export function executeArcJavaScript(code, options = {}) {
    const { tabId } = options;
    const browserApp = getBrowserApp();
    // Base64 encode the JavaScript to avoid escaping issues
    const encodedCode = Buffer.from(code).toString("base64");
    // Build the AppleScript - use atob() in JavaScript instead of shell script
    const tabSelector = tabId ? `tab id ${tabId}` : "active tab";
    const appleScript = `
tell application "${browserApp}"
  tell front window
    tell ${tabSelector}
      execute javascript "eval(atob('${encodedCode}'))"
    end tell
  end tell
end tell
  `.trim();
    try {
        const result = execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, {
            encoding: 'utf-8',
        });
        return parseAppleScriptResult(result.trim());
    }
    catch (error) {
        throw new Error(`Failed to execute ${browserApp} JavaScript: ${error.message}`);
    }
}
/**
 * Parses the result from AppleScript execution.
 * Attempts to parse as JSON, falls back to string.
 */
function parseAppleScriptResult(result) {
    if (!result)
        return null;
    // Chrome returns "missing value" for null/undefined
    if (result === 'missing value')
        return null;
    try {
        return JSON.parse(result);
    }
    catch {
        return result;
    }
}
//# sourceMappingURL=index.js.map