import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);
/**
 * Executes JavaScript code in an Arc browser tab via AppleScript.
 *
 * @param code - The JavaScript code to execute
 * @param options - Execution options
 * @returns The result of the JavaScript execution
 * @throws Error if the AppleScript execution fails
 */
export async function executeArcJavaScript(code, options = {}) {
    const { tabId, timeout = 30000 } = options;
    // Base64 encode the JavaScript to avoid escaping issues
    const encodedCode = Buffer.from(code).toString("base64");
    // Build the AppleScript
    const tabSelector = tabId ? `tab id ${tabId}` : "active tab";
    const appleScript = `
tell application "Arc"
  tell front window
    tell ${tabSelector}
      set encodedCode to "${encodedCode}"
      set decodedCode to do shell script "echo " & quoted form of encodedCode & " | base64 -d"
      execute javascript decodedCode
    end tell
  end tell
end tell
  `.trim();
    try {
        const { stdout } = await execAsync(`osascript -e '${appleScript}'`, {
            timeout,
        });
        return parseAppleScriptResult(stdout.trim());
    }
    catch (error) {
        throw new Error(`Failed to execute Arc JavaScript: ${error.message}`);
    }
}
/**
 * Parses the result from AppleScript execution.
 * Attempts to parse as JSON, falls back to string.
 */
function parseAppleScriptResult(result) {
    if (!result)
        return null;
    try {
        return JSON.parse(result);
    }
    catch {
        return result;
    }
}
//# sourceMappingURL=index.js.map