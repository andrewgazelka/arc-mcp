/**
 * Navigation and tab management functions
 * These use pure AppleScript (not browser JavaScript)
 */
export interface TabInfo {
    id?: number;
    title: string;
    url: string;
}
/**
 * Open a URL in Arc browser
 */
export declare function openUrl(url: string, newTab?: boolean): Promise<{
    success: true;
}>;
/**
 * Get information about the current active tab
 */
export declare function getCurrentTab(): Promise<TabInfo>;
/**
 * List all open tabs
 */
export declare function listTabs(): Promise<TabInfo[]>;
/**
 * Close a specific tab by index (1-based)
 */
export declare function closeTab(tabId: number): Promise<void>;
/**
 * Switch to a specific tab by index (1-based)
 */
export declare function switchToTab(tabId: number): Promise<void>;
/**
 * Reload a tab by index (1-based), or current tab if not specified
 */
export declare function reloadTab(tabId?: number): Promise<void>;
/**
 * Navigate back in browser history
 */
export declare function goBack(tabId?: number): Promise<void>;
/**
 * Navigate forward in browser history
 */
export declare function goForward(tabId?: number): Promise<void>;
/**
 * Execute arbitrary JavaScript in a tab by index (1-based), or current tab if not specified
 */
export declare function executeJavaScript(code: string, tabId?: number): Promise<any>;
/**
 * Check if Arc is running
 */
export declare function ensureArcRunning(): void;
//# sourceMappingURL=navigation.d.ts.map