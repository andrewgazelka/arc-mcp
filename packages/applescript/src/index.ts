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
 * Get the browser application name from environment.
 * Defaults to "Arc", can be overridden with BROWSER=chrome
 */
export function getBrowserApp(): string {
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
export function executeArcJavaScript(
  code: string,
  options: ExecuteOptions = {}
): any {
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
  } catch (error: any) {
    throw new Error(`Failed to execute ${browserApp} JavaScript: ${error.message}`);
  }
}

/**
 * Parses the result from AppleScript execution.
 * Arc wraps string results in quotes, so JSON.stringify output appears as "{...}".
 * We recursively parse to unwrap these layers.
 */
function parseAppleScriptResult(result: string): any {
  if (!result) return null;
  // Chrome returns "missing value" for null/undefined
  if (result === 'missing value') return null;

  try {
    const parsed = JSON.parse(result);
    // If we parsed and got a string that looks like JSON, parse it again
    // This handles Arc's double-encoding of JSON.stringify results
    if (typeof parsed === 'string' && (parsed.startsWith('{') || parsed.startsWith('['))) {
      try {
        return JSON.parse(parsed);
      } catch {
        return parsed;
      }
    }
    return parsed;
  } catch {
    return result;
  }
}
