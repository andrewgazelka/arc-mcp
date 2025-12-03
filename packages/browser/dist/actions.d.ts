/**
 * Browser-side actions for interacting with elements
 * This code gets injected into Arc browser and executed
 */
/**
 * Describe an element for user feedback
 */
declare function describeElement(el: Element): string;
/**
 * Click an element
 */
declare function clickElement(locator: any): any;
/**
 * Fill an input with a value (fast, replaces entire value)
 */
declare function fillElement(locator: any, value: string): any;
/**
 * Type text character by character (triggers autocomplete)
 */
declare function typeElement(locator: any, text: string): any;
/**
 * Select an option from a dropdown
 */
declare function selectOption(locator: any, option: string): any;
//# sourceMappingURL=actions.d.ts.map