/**
 * Browser-side actions for interacting with elements
 * This code gets injected into Arc browser and executed
 */

/**
 * Describe an element for user feedback
 */
function describeElement(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const text = el.textContent?.substring(0, 30).trim() || '';
  const ariaLabel = el.getAttribute('aria-label');

  if (ariaLabel) {
    return `<${tag}${id} aria-label="${ariaLabel}">`;
  }
  if (text) {
    return `<${tag}${id}>${text}`;
  }
  return `<${tag}${id}>`;
}

/**
 * Click an element
 */
function clickElement(locator: any): any {
  const element = findElement(locator);

  if (!element) {
    return {
      success: false,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  // Dispatch proper mouse events
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
  (element as HTMLElement).click();

  return {
    success: true,
    element: describeElement(element),
  };
}

/**
 * Fill an input with a value (fast, replaces entire value)
 */
function fillElement(locator: any, value: string): any {
  const element = findElement(locator);

  if (!element) {
    return {
      success: false,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  if (!['INPUT', 'TEXTAREA'].includes(element.tagName)) {
    return {
      success: false,
      error: `Element is not an input or textarea: ${element.tagName}`,
    };
  }

  const input = element as HTMLInputElement;

  // Clear and set value
  input.value = '';
  input.value = value;

  // Dispatch events
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));

  return {
    success: true,
    element: describeElement(element),
  };
}

/**
 * Type text character by character (triggers autocomplete)
 */
function typeElement(locator: any, text: string): any {
  const element = findElement(locator);

  if (!element) {
    return {
      success: false,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  if (!['INPUT', 'TEXTAREA'].includes(element.tagName)) {
    return {
      success: false,
      error: `Element is not an input or textarea: ${element.tagName}`,
    };
  }

  const input = element as HTMLInputElement;
  input.focus();

  // Type character by character
  for (const char of text) {
    input.value += char;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
  }

  return {
    success: true,
    element: describeElement(element),
  };
}

/**
 * Select an option from a dropdown
 */
function selectOption(locator: any, option: string): any {
  const element = findElement(locator);

  if (!element) {
    return {
      success: false,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  if (element.tagName !== 'SELECT') {
    return {
      success: false,
      error: `Element is not a select: ${element.tagName}`,
    };
  }

  const select = element as HTMLSelectElement;
  const options = Array.from(select.options);

  // Find option by text or value
  const optionEl = options.find(
    (o) => o.text === option || o.value === option
  );

  if (!optionEl) {
    const available = options.map((o) => o.text).join(', ');
    return {
      success: false,
      error: `Option not found: "${option}". Available: ${available}`,
    };
  }

  select.value = optionEl.value;
  select.dispatchEvent(new Event('change', { bubbles: true }));

  return {
    success: true,
    element: describeElement(element),
  };
}
