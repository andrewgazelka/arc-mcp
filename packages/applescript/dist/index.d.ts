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
export declare function executeArcJavaScript(code: string, options?: ExecuteOptions): Promise<any>;
//# sourceMappingURL=index.d.ts.map