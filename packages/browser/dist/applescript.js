/**
 * AppleScript execution utilities for controlling Arc browser
 */
import { execSync } from 'child_process';
/**
 * Execute AppleScript and return the result
 */
export function executeAppleScript(script) {
    try {
        const result = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
            encoding: 'utf-8',
        });
        return result.trim();
    }
    catch (error) {
        const err = error;
        throw new Error(`AppleScript execution failed: ${err.message}`);
    }
}
/**
 * Check if Arc is running
 */
export function ensureArcRunning() {
    const script = `
    tell application "System Events"
      return (name of processes) contains "Arc"
    end tell
  `;
    const isRunning = executeAppleScript(script);
    if (isRunning !== 'true') {
        throw new Error('Arc browser is not running');
    }
}
/**
 * Execute JavaScript in Arc browser and return result
 */
export function executeJavaScript(code, tabId) {
    const tabSelector = tabId ? `tab ${tabId}` : 'active tab';
    const base64Code = Buffer.from(code).toString('base64');
    const script = `
    tell application "Arc"
      tell front window
        tell ${tabSelector}
          execute javascript "eval(atob('${base64Code}'))"
        end tell
      end tell
    end tell
  `;
    return executeAppleScript(script);
}
//# sourceMappingURL=applescript.js.map