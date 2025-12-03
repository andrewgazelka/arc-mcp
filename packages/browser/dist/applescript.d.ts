/**
 * AppleScript execution utilities for controlling browsers
 * Supports Arc (default) and Google Chrome via BROWSER env var
 */
/**
 * Get the browser application name from environment.
 * Defaults to "Arc", can be overridden with BROWSER=chrome
 */
export declare function getBrowserApp(): string;
/**
 * Execute AppleScript and return the result
 */
export declare function executeAppleScript(script: string): string;
/**
 * Check if the browser is running
 */
export declare function ensureBrowserRunning(): void;
export declare const ensureArcRunning: typeof ensureBrowserRunning;
/**
 * Execute JavaScript in the browser and return result
 */
export declare function executeJavaScript(code: string, tabId?: number): string;
//# sourceMappingURL=applescript.d.ts.map