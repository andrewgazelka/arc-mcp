/**
 * AppleScript execution utilities for controlling browsers
 * Supports Arc (default) and Google Chrome via BROWSER env var
 */

import { execSync } from 'child_process';

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
 * Execute AppleScript and return the result
 */
export function executeAppleScript(script: string): string {
  try {
    const result = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      encoding: 'utf-8',
    });
    return result.trim();
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(`AppleScript execution failed: ${err.message}`);
  }
}

/**
 * Check if the browser is running
 */
export function ensureBrowserRunning(): void {
  const browserApp = getBrowserApp();
  const processName = browserApp === 'Google Chrome' ? 'Google Chrome' : 'Arc';
  const script = `
    tell application "System Events"
      return (name of processes) contains "${processName}"
    end tell
  `;
  const isRunning = executeAppleScript(script);
  if (isRunning !== 'true') {
    throw new Error(`${browserApp} browser is not running`);
  }
}

// Alias for backward compatibility
export const ensureArcRunning = ensureBrowserRunning;

/**
 * Execute JavaScript in the browser and return result
 */
export function executeJavaScript(code: string, tabId?: number): string {
  const browserApp = getBrowserApp();
  const tabSelector = tabId ? `tab ${tabId}` : 'active tab';
  const base64Code = Buffer.from(code).toString('base64');

  const script = `
    tell application "${browserApp}"
      tell front window
        tell ${tabSelector}
          execute javascript "eval(atob('${base64Code}'))"
        end tell
      end tell
    end tell
  `;

  return executeAppleScript(script);
}
