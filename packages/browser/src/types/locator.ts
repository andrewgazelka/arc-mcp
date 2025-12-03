/**
 * Semantic locator strategies for finding elements
 */
export type LocatorStrategy =
  | { role: { role: string; name?: string } }
  | { label: string }
  | { text: string; exact?: boolean }
  | { placeholder: string }
  | { testId: string }
  | { css: string };

/**
 * Role-based locator with optional accessible name
 */
export interface RoleLocator {
  role: string;
  name?: string;
}

/**
 * Supported ARIA roles with implicit HTML element mappings
 */
export const ROLE_MAPPINGS: Record<string, string> = {
  button: 'BUTTON, [type="button"], [type="submit"], [role="button"]',
  link: 'A[href], [role="link"]',
  textbox: 'INPUT[type="text"], INPUT:not([type]), TEXTAREA, [role="textbox"]',
  searchbox: 'INPUT[type="search"], [role="searchbox"]',
  combobox: 'SELECT, [role="combobox"]',
  checkbox: 'INPUT[type="checkbox"], [role="checkbox"]',
  radio: 'INPUT[type="radio"], [role="radio"]',
  tab: '[role="tab"]',
  menuitem: '[role="menuitem"]',
  option: 'OPTION, [role="option"]',
};
