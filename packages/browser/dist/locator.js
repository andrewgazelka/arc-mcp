"use strict";
/**
 * Browser-side semantic locator engine
 * This code gets injected into Arc browser and executed
 */
/**
 * Find element by ARIA role (explicit or implicit)
 */
function findByRole(role, name) {
    const candidates = [];
    // Add explicit role attributes
    const explicitRoles = document.querySelectorAll(`[role="${role}"]`);
    candidates.push(...Array.from(explicitRoles));
    // Add implicit HTML elements that map to this role
    const implicitMap = {
        button: 'BUTTON, [type="button"], [type="submit"]',
        link: 'A[href]',
        textbox: 'INPUT[type="text"], INPUT:not([type]), TEXTAREA',
        searchbox: 'INPUT[type="search"]',
        combobox: 'SELECT',
        checkbox: 'INPUT[type="checkbox"]',
        radio: 'INPUT[type="radio"]',
        tab: '',
        menuitem: '',
        option: 'OPTION',
    };
    if (implicitMap[role]) {
        const implicitElements = document.querySelectorAll(implicitMap[role]);
        candidates.push(...Array.from(implicitElements));
    }
    if (!name) {
        return candidates[0] || null;
    }
    // Filter by accessible name
    for (const el of candidates) {
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        const textContent = el.textContent?.trim();
        if (ariaLabel === name || textContent === name) {
            return el;
        }
        if (ariaLabelledBy) {
            const labelEl = document.getElementById(ariaLabelledBy);
            if (labelEl && labelEl.textContent?.trim() === name) {
                return el;
            }
        }
    }
    return null;
}
/**
 * Find input by associated label text
 */
function findByLabel(labelText) {
    const labels = Array.from(document.querySelectorAll('label'));
    for (const label of labels) {
        if (label.textContent?.includes(labelText)) {
            // Check for explicit 'for' attribute
            if (label.htmlFor) {
                return document.getElementById(label.htmlFor);
            }
            // Check for nested input
            const nested = label.querySelector('input, select, textarea');
            if (nested) {
                return nested;
            }
        }
    }
    return null;
}
/**
 * Find element by visible text content
 */
function findByText(text, exact = false) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const matches = [];
    let node;
    while ((node = walker.nextNode())) {
        const content = node.textContent?.trim() || '';
        const isMatch = exact ? content === text : content.includes(text);
        if (isMatch && node.parentElement) {
            matches.push(node.parentElement);
        }
    }
    // Prefer interactive elements
    const interactive = matches.find((el) => ['A', 'BUTTON', 'INPUT', 'SELECT'].includes(el.tagName));
    return interactive || matches[0] || null;
}
/**
 * Find input by placeholder attribute
 */
function findByPlaceholder(placeholder) {
    return document.querySelector(`[placeholder="${placeholder}"]`);
}
/**
 * Find element by data-testid attribute
 */
function findByTestId(testId) {
    return document.querySelector(`[data-testid="${testId}"]`);
}
/**
 * Main locator dispatcher
 */
function findElement(locator) {
    if ('role' in locator) {
        return findByRole(locator.role.role, locator.role.name);
    }
    if ('label' in locator) {
        return findByLabel(locator.label);
    }
    if ('text' in locator) {
        return findByText(locator.text, locator.exact);
    }
    if ('placeholder' in locator) {
        return findByPlaceholder(locator.placeholder);
    }
    if ('testId' in locator) {
        return findByTestId(locator.testId);
    }
    if ('css' in locator) {
        return document.querySelector(locator.css);
    }
    return null;
}
//# sourceMappingURL=locator.js.map