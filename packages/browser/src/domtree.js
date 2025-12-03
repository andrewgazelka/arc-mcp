/**
 * Build a proper tree-based DOM structure matching the user's format
 */

let nodeIdCounter = 0;

/**
 * Map HTML element to semantic type
 */
function getSemanticType(el) {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');

  // Explicit roles take precedence
  if (role) {
    return role;
  }

  // Map common HTML elements to semantic types
  const typeMap = {
    nav: 'navigation',
    header: 'header',
    footer: 'footer',
    main: 'main',
    aside: 'aside',
    section: 'section',
    article: 'article',
    form: 'form',
    button: 'button',
    a: 'link',
    input: getInputType(el),
    select: 'select',
    textarea: 'textbox',
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    h5: 'heading',
    h6: 'heading',
    ul: 'list',
    ol: 'list',
    li: 'listitem',
    img: 'image',
    dialog: 'dialog',
  };

  return typeMap[tag] || tag;
}

/**
 * Get specific input type
 */
function getInputType(input) {
  const type = input.type || 'text';
  const typeMap = {
    text: 'textbox',
    search: 'searchbox',
    email: 'textbox',
    password: 'textbox',
    tel: 'textbox',
    url: 'textbox',
    number: 'textbox',
    date: 'datepicker',
    time: 'timepicker',
    datetime: 'datepicker',
    'datetime-local': 'datepicker',
    month: 'datepicker',
    week: 'datepicker',
    checkbox: 'checkbox',
    radio: 'radio',
    button: 'button',
    submit: 'button',
    reset: 'button',
  };

  return typeMap[type] || 'textbox';
}

/**
 * Check if element is interactive and should get an ID
 */
function isInteractive(el) {
  const tag = el.tagName.toLowerCase();
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'label'];

  if (interactiveTags.includes(tag)) {
    return true;
  }

  const role = el.getAttribute('role');
  const interactiveRoles = [
    'button',
    'link',
    'tab',
    'menuitem',
    'option',
    'checkbox',
    'radio',
    'textbox',
    'searchbox',
    'combobox',
  ];

  if (role && interactiveRoles.includes(role)) {
    return true;
  }

  if (el.getAttribute('onclick') || el.getAttribute('ng-click')) {
    return true;
  }

  return false;
}

/**
 * Get label for an element
 */
function getElementLabel(el) {
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  const ariaLabelledBy = el.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelEl = document.getElementById(ariaLabelledBy);
    if (labelEl) {
      return labelEl.textContent?.trim();
    }
  }

  if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
    const id = el.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        return label.textContent?.trim();
      }
    }

    const parentLabel = el.closest('label');
    if (parentLabel) {
      const clone = parentLabel.cloneNode(true);
      const input = clone.querySelector('input, select, textarea');
      if (input) {
        input.remove();
      }
      return clone.textContent?.trim();
    }
  }

  if (el.tagName === 'LABEL') {
    return el.textContent?.trim();
  }

  return undefined;
}

/**
 * Get visible text content (first 50 chars)
 */
function getVisibleText(el) {
  const clone = el.cloneNode(true);

  const toRemove = clone.querySelectorAll('script, style, [hidden]');
  toRemove.forEach((n) => n.remove());

  const text = clone.textContent?.trim();
  if (!text) {
    return undefined;
  }

  return text.length > 50 ? text.substring(0, 50) : text;
}

/**
 * Build DOM tree node
 */
function buildNode(el, depth, maxDepth) {
  if (depth > maxDepth) {
    return null;
  }

  const type = getSemanticType(el);
  const interactive = isInteractive(el);

  const node = { type };

  if (interactive) {
    node.id = ++nodeIdCounter;
  }

  const label = getElementLabel(el);
  if (label) {
    node.label = label;
  }

  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    const input = el;
    if (input.value) {
      node.value = input.value;
    }
    if (input.placeholder) {
      node.placeholder = input.placeholder;
    }
  }

  if (el.tagName === 'SELECT') {
    const select = el;
    const selected = select.options[select.selectedIndex];
    if (selected) {
      node.value = selected.text;
    }
  }

  if (el.tagName === 'A') {
    const anchor = el;
    if (anchor.href) {
      node.href = anchor.href;
    }
  }

  if (el.tagName === 'BUTTON') {
    const button = el;
    if (button.type === 'submit' || button.classList.contains('primary')) {
      node.primary = true;
    }
  }

  if (el.classList.contains('active') || el.getAttribute('aria-current') === 'page') {
    node.active = true;
  }

  const children = [];
  for (const child of Array.from(el.children)) {
    const childNode = buildNode(child, depth + 1, maxDepth);
    if (childNode) {
      children.push(childNode);
    }
  }

  if (children.length > 0) {
    node.children = children;
  } else {
    const text = getVisibleText(el);
    if (text) {
      if (type === 'text' || type === 'p' || type === 'span' || type === 'div') {
        node.content = text;
      } else {
        node.text = text;
      }
    }
  }

  if (!interactive && children.length === 0 && !node.text && !node.content && depth > 0) {
    return null;
  }

  return node;
}

/**
 * Get page structure
 */
function getPageStructure(maxDepth = 10) {
  nodeIdCounter = 0;

  const tree = buildNode(document.body, 0, maxDepth);

  return {
    page: document.title,
    url: window.location.href,
    tree: tree,
  };
}
