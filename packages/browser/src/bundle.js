(function() {
  'use strict';

  

function findByRole(role, name?)= [];

  const explicitRoles = document.querySelectorAll(`[role="${role}"]`);
  candidates.push(...Array.from(explicitRoles));

  const implicitMap<string, string> = {
    button: 'BUTTON, [type="button"], [type="submit"]',
    link: 'A[href]',
    textbox: 'INPUT[type="text"], INPUT([type]), TEXTAREA',
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

function findByLabel(labelText)= Array.from(document.querySelectorAll('label'));

  for (const label of labels) {
    if (label.textContent?.includes(labelText)) {
      
      if (label.htmlFor) {
        return document.getElementById(label.htmlFor);
      }

      const nested = label.querySelector('input, select, textarea');
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

function findByText(text, exact = false)= document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  const matches = [];
  let node= walker.nextNode())) {
    const content = node.textContent?.trim() || '';
    const isMatch = exact ? content === text .includes(text);

    if (isMatch && node.parentElement) {
      matches.push(node.parentElement);
    }
  }

  const interactive = matches.find((el) =>
    ['A', 'BUTTON', 'INPUT', 'SELECT'].includes(el.tagName)
  );

  return interactive || matches[0] || null;
}

function findByPlaceholder(placeholder)="${placeholder}"]`);
}

function findByTestId(testId)="${testId}"]`);
}

function findElement(locator)

  

function describeElement(el) {
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

function clickElement(locator) {
  const element = findElement(locator);

  if (!element) {
    return {
      success,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  element.dispatchEvent(new MouseEvent('mousedown', { bubbles, cancelable }));
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles, cancelable }));
  (element ).click();

  return {
    success,
    element(element),
  };
}

function fillElement(locator, value) {
  const element = findElement(locator);

  if (!element) {
    return {
      success,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  if (!['INPUT', 'TEXTAREA'].includes(element.tagName)) {
    return {
      success,
      error: `Element is not an input or textarea: ${element.tagName}`,
    };
  }

  const input = element ;

  input.value = '';
  input.value = value;

  input.dispatchEvent(new Event('input', { bubbles }));
  input.dispatchEvent(new Event('change', { bubbles }));

  return {
    success,
    element(element),
  };
}

function typeElement(locator, text) {
  const element = findElement(locator);

  if (!element) {
    return {
      success,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  if (!['INPUT', 'TEXTAREA'].includes(element.tagName)) {
    return {
      success,
      error: `Element is not an input or textarea: ${element.tagName}`,
    };
  }

  const input = element ;
  input.focus();

  for (const char of text) {
    input.value += char;
    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles }));
    input.dispatchEvent(new KeyboardEvent('keypress', { key, bubbles }));
    input.dispatchEvent(new Event('input', { bubbles }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles }));
  }

  return {
    success,
    element(element),
  };
}

function selectOption(locator, option) {
  const element = findElement(locator);

  if (!element) {
    return {
      success,
      error: `Element not found: ${JSON.stringify(locator)}`,
    };
  }

  if (element.tagName !== 'SELECT') {
    return {
      success,
      error: `Element is not a select: ${element.tagName}`,
    };
  }

  const select = element ;
  const options = Array.from(select.options);

  const optionEl = options.find(
    (o) => o.text === option || o.value === option
  );

  if (!optionEl) {
    const available = options.map((o) => o.text).join(', ');
    return {
      success,
      error: `Option not found: "${option}". Available: ${available}`,
    };
  }

  select.value = optionEl.value;
  select.dispatchEvent(new Event('change', { bubbles }));

  return {
    success,
    element(element),
  };
}


  

let nodeIdCounter = 0;

function getSemanticType(el) {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');

  if (role) {
    return role;
  }

  const typeMap<string, string> = {
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
    input(el ),
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

function getInputType(input) {
  const type = input.type || 'text';
  const typeMap<string, string> = {
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

function getElementLabel(el)= el.getAttribute('aria-label');
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
      const clone = parentLabel.cloneNode(true) ;
      const input = clone.querySelector('input, select, textarea');
      if (input) {
        input.remove();
      }
      return clone.textContent?.trim();
    }
  }

  if (el.tagName === 'LABEL') {
    return (el ).textContent?.trim();
  }

  return undefined;
}

function getVisibleText(el)= el.cloneNode(true) ;

  const toRemove = clone.querySelectorAll('script, style, [hidden]');
  toRemove.forEach((n) => n.remove());

  const text = clone.textContent?.trim();
  if (!text) {
    return undefined;
  }

  return text.length > 50 ? text.substring(0, 50) ;
}

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
    const input = el ;
    if (input.value) {
      node.value = input.value;
    }
    if (input.placeholder) {
      node.placeholder = input.placeholder;
    }
  }

  if (el.tagName === 'SELECT') {
    const select = el ;
    const selected = select.options[select.selectedIndex];
    if (selected) {
      node.value = selected.text;
    }
  }

  if (el.tagName === 'A') {
    const anchor = el ;
    if (anchor.href) {
      node.href = anchor.href;
    }
  }

  if (el.tagName === 'BUTTON') {
    const button = el ;
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

function getPageStructure(maxDepth = 10) {
  nodeIdCounter = 0;

  const tree = buildNode(document.body, 0, maxDepth);

  return {
    page.title,
    url.location.href,
    tree,
  };
}


  // Return results as JSON
  window.__arcMCPResult = function(result) {
    return JSON.stringify(result);
  };
})();