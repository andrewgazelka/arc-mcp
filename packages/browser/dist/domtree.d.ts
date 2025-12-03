/**
 * Build a proper tree-based DOM structure matching the user's format
 */
declare let nodeIdCounter: number;
/**
 * Map HTML element to semantic type
 */
declare function getSemanticType(el: Element): string;
/**
 * Get specific input type
 */
declare function getInputType(input: HTMLInputElement): string;
/**
 * Check if element is interactive and should get an ID
 */
declare function isInteractive(el: Element): boolean;
/**
 * Get label for an element
 */
declare function getElementLabel(el: Element): string | undefined;
/**
 * Get visible text content (first 50 chars)
 */
declare function getVisibleText(el: Element): string | undefined;
/**
 * Build DOM tree node
 */
declare function buildNode(el: Element, depth: number, maxDepth: number): any;
/**
 * Get page structure
 */
declare function getPageStructure(maxDepth?: number): any;
//# sourceMappingURL=domtree.d.ts.map