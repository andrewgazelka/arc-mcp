/**
 * Supported ARIA roles with implicit HTML element mappings
 */
export const ROLE_MAPPINGS = {
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
//# sourceMappingURL=locator.js.map