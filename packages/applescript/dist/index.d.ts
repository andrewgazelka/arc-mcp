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
export declare function getBrowserApp(): string;
/**
 * Executes JavaScript code in a browser tab via AppleScript.
 * Supports Arc (default) and Google Chrome via BROWSER env var.
 *
 * @param code - The JavaScript code to execute
 * @param options - Execution options
 * @returns The result of the JavaScript execution
 * @throws Error if the AppleScript execution fails
 */
export declare function executeArcJavaScript(code: string, options?: ExecuteOptions): any;
//# sourceMappingURL=index.d.ts.map