import { execSync } from "child_process";

export interface ExecuteOptions {
  /**
   * The tab ID to execute the JavaScript in.
   * If not provided, executes in the active tab.
   */
  tabId?: string;

  /**
   * Timeout in milliseconds (default: 30000)
   */
  timeout?: number;
}

/**
 * Executes JavaScript code in an Arc browser tab via AppleScript.
 *
 * @param code - The JavaScript code to execute
 * @param options - Execution options
 * @returns The result of the JavaScript execution
 * @throws Error if the AppleScript execution fails
 */
export function executeArcJavaScript(
  code: string,
  options: ExecuteOptions = {}
): any {
  const { tabId } = options;

  // Base64 encode the JavaScript to avoid escaping issues
  const encodedCode = Buffer.from(code).toString("base64");

  // Build the AppleScript - use atob() in JavaScript instead of shell script
  const tabSelector = tabId ? `tab id ${tabId}` : "active tab";
  const appleScript = `
tell application "Arc"
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
  } catch (error: any) {
    throw new Error(`Failed to execute Arc JavaScript: ${error.message}`);
  }
}

/**
 * Parses the result from AppleScript execution.
 * Attempts to parse as JSON, falls back to string.
 */
function parseAppleScriptResult(result: string): any {
  if (!result) return null;

  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}
