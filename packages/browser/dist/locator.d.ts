/**
 * Browser-side semantic locator engine
 * This code gets injected into Arc browser and executed
 */
/**
 * Find element by ARIA role (explicit or implicit)
 */
declare function findByRole(role: string, name?: string): Element | null;
/**
 * Find input by associated label text
 */
declare function findByLabel(labelText: string): Element | null;
/**
 * Find element by visible text content
 */
declare function findByText(text: string, exact?: boolean): Element | null;
/**
 * Find input by placeholder attribute
 */
declare function findByPlaceholder(placeholder: string): Element | null;
/**
 * Find element by data-testid attribute
 */
declare function findByTestId(testId: string): Element | null;
/**
 * Main locator dispatcher
 */
declare function findElement(locator: any): Element | null;
//# sourceMappingURL=locator.d.ts.map