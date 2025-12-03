var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

// src/repl.ts
var AsyncFunction = Object.getPrototypeOf(async function() {
}).constructor;

// ../browser/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  click: () => click,
  closeTab: () => closeTab,
  ensureArcRunning: () => ensureArcRunning,
  executeArcJavaScript: () => executeArcJavaScript,
  executeJavaScript: () => executeJavaScript,
  fill: () => fill,
  getCurrentTab: () => getCurrentTab,
  getPageStructure: () => getPageStructure,
  goBack: () => goBack,
  goForward: () => goForward,
  listTabs: () => listTabs,
  openUrl: () => openUrl,
  reloadTab: () => reloadTab,
  selectOption: () => selectOption,
  switchToTab: () => switchToTab,
  type: () => type
});

// ../applescript/dist/index.js
import { exec } from "child_process";
import { promisify } from "util";
var execAsync = promisify(exec);
async function executeArcJavaScript(code, options = {}) {
  const { tabId, timeout = 3e4 } = options;
  const encodedCode = Buffer.from(code).toString("base64");
  const tabSelector = tabId ? `tab id ${tabId}` : "active tab";
  const appleScript = `
tell application "Arc"
  tell front window
    tell ${tabSelector}
      set encodedCode to "${encodedCode}"
      set decodedCode to do shell script "echo " & quoted form of encodedCode & " | base64 -d"
      execute javascript decodedCode
    end tell
  end tell
end tell
  `.trim();
  try {
    const { stdout } = await execAsync(`osascript -e '${appleScript}'`, {
      timeout
    });
    return parseAppleScriptResult(stdout.trim());
  } catch (error) {
    throw new Error(`Failed to execute Arc JavaScript: ${error.message}`);
  }
}
function parseAppleScriptResult(result) {
  if (!result)
    return null;
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}

// ../browser/dist/applescript.js
import { execSync } from "child_process";
function executeAppleScript(script) {
  try {
    const result = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      encoding: "utf-8"
    });
    return result.trim();
  } catch (error) {
    const err = error;
    throw new Error(`AppleScript execution failed: ${err.message}`);
  }
}

// ../browser/dist/navigation.js
async function openUrl(url, newTab = true) {
  const script = newTab ? `tell application "Arc" to tell front window to make new tab with properties {URL:"${url}"}` : `tell application "Arc" to open location "${url}"`;
  executeAppleScript(script);
  return { success: true };
}
async function getCurrentTab() {
  const script = `
    tell application "Arc"
      tell front window
        return (title of active tab) & "|" & (URL of active tab)
      end tell
    end tell
  `;
  const result = executeAppleScript(script);
  const [title, url] = result.split("|");
  return { title, url };
}
async function listTabs() {
  const script = `
    tell application "Arc"
      tell front window
        set tabList to {}
        set tabIndex to 1
        repeat with t in tabs
          set end of tabList to (tabIndex as string) & "|" & (title of t) & "|" & (URL of t)
          set tabIndex to tabIndex + 1
        end repeat
        return tabList
      end tell
    end tell
  `;
  const result = executeAppleScript(script);
  if (!result)
    return [];
  return result.split(", ").map((line) => {
    const parts = line.split("|");
    const id = parts[0];
    const title = parts[1] ?? "";
    const url = parts[2] ?? "";
    return { id: parseInt(id ?? "0"), title, url };
  });
}
async function closeTab(tabId) {
  const script = `
    tell application "Arc"
      tell front window
        close tab ${tabId}
      end tell
    end tell
  `;
  executeAppleScript(script);
}
async function switchToTab(tabId) {
  const script = `
    tell application "Arc"
      tell front window
        set active tab to tab ${tabId}
      end tell
    end tell
  `;
  executeAppleScript(script);
}
async function reloadTab(tabId) {
  const script = tabId ? `tell application "Arc" to tell front window to reload tab ${tabId}` : `tell application "Arc" to tell front window to reload active tab`;
  executeAppleScript(script);
}
async function goBack(tabId) {
  const tabSelector = tabId ? `tab ${tabId}` : "active tab";
  const script = `
    tell application "Arc"
      tell front window
        tell ${tabSelector}
          execute javascript "window.history.back()"
        end tell
      end tell
    end tell
  `;
  executeAppleScript(script);
}
async function goForward(tabId) {
  const tabSelector = tabId ? `tab ${tabId}` : "active tab";
  const script = `
    tell application "Arc"
      tell front window
        tell ${tabSelector}
          execute javascript "window.history.forward()"
        end tell
      end tell
    end tell
  `;
  executeAppleScript(script);
}
async function executeJavaScript(code, tabId) {
  const tabSelector = tabId ? `tab ${tabId}` : "active tab";
  const base64Code = Buffer.from(code).toString("base64");
  const script = `
    tell application "Arc"
      tell front window
        tell ${tabSelector}
          execute javascript "eval(atob('${base64Code}'))"
        end tell
      end tell
    end tell
  `;
  const result = executeAppleScript(script);
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}
function ensureArcRunning() {
  const script = `
    tell application "System Events"
      return (name of processes) contains "Arc"
    end tell
  `;
  const isRunning = executeAppleScript(script);
  if (isRunning !== "true") {
    throw new Error("Arc browser is not running");
  }
}

// ../browser/dist/bundle-export.js
var BROWSER_BUNDLE = "(function() {\n  'use strict';\n\n  \n\nfunction findByRole(role, name?)= [];\n\n  const explicitRoles = document.querySelectorAll(`[role=\"${role}\"]`);\n  candidates.push(...Array.from(explicitRoles));\n\n  const implicitMap<string, string> = {\n    button: 'BUTTON, [type=\"button\"], [type=\"submit\"]',\n    link: 'A[href]',\n    textbox: 'INPUT[type=\"text\"], INPUT([type]), TEXTAREA',\n    searchbox: 'INPUT[type=\"search\"]',\n    combobox: 'SELECT',\n    checkbox: 'INPUT[type=\"checkbox\"]',\n    radio: 'INPUT[type=\"radio\"]',\n    tab: '',\n    menuitem: '',\n    option: 'OPTION',\n  };\n\n  if (implicitMap[role]) {\n    const implicitElements = document.querySelectorAll(implicitMap[role]);\n    candidates.push(...Array.from(implicitElements));\n  }\n\n  if (!name) {\n    return candidates[0] || null;\n  }\n\n  for (const el of candidates) {\n    const ariaLabel = el.getAttribute('aria-label');\n    const ariaLabelledBy = el.getAttribute('aria-labelledby');\n    const textContent = el.textContent?.trim();\n\n    if (ariaLabel === name || textContent === name) {\n      return el;\n    }\n\n    if (ariaLabelledBy) {\n      const labelEl = document.getElementById(ariaLabelledBy);\n      if (labelEl && labelEl.textContent?.trim() === name) {\n        return el;\n      }\n    }\n  }\n\n  return null;\n}\n\nfunction findByLabel(labelText)= Array.from(document.querySelectorAll('label'));\n\n  for (const label of labels) {\n    if (label.textContent?.includes(labelText)) {\n      \n      if (label.htmlFor) {\n        return document.getElementById(label.htmlFor);\n      }\n\n      const nested = label.querySelector('input, select, textarea');\n      if (nested) {\n        return nested;\n      }\n    }\n  }\n\n  return null;\n}\n\nfunction findByText(text, exact = false)= document.createTreeWalker(\n    document.body,\n    NodeFilter.SHOW_TEXT,\n    null\n  );\n\n  const matches = [];\n  let node= walker.nextNode())) {\n    const content = node.textContent?.trim() || '';\n    const isMatch = exact ? content === text .includes(text);\n\n    if (isMatch && node.parentElement) {\n      matches.push(node.parentElement);\n    }\n  }\n\n  const interactive = matches.find((el) =>\n    ['A', 'BUTTON', 'INPUT', 'SELECT'].includes(el.tagName)\n  );\n\n  return interactive || matches[0] || null;\n}\n\nfunction findByPlaceholder(placeholder)=\"${placeholder}\"]`);\n}\n\nfunction findByTestId(testId)=\"${testId}\"]`);\n}\n\nfunction findElement(locator)\n\n  \n\nfunction describeElement(el) {\n  const tag = el.tagName.toLowerCase();\n  const id = el.id ? `#${el.id}` : '';\n  const text = el.textContent?.substring(0, 30).trim() || '';\n  const ariaLabel = el.getAttribute('aria-label');\n\n  if (ariaLabel) {\n    return `<${tag}${id} aria-label=\"${ariaLabel}\">`;\n  }\n  if (text) {\n    return `<${tag}${id}>${text}`;\n  }\n  return `<${tag}${id}>`;\n}\n\nfunction clickElement(locator) {\n  const element = findElement(locator);\n\n  if (!element) {\n    return {\n      success,\n      error: `Element not found: ${JSON.stringify(locator)}`,\n    };\n  }\n\n  element.dispatchEvent(new MouseEvent('mousedown', { bubbles, cancelable }));\n  element.dispatchEvent(new MouseEvent('mouseup', { bubbles, cancelable }));\n  (element ).click();\n\n  return {\n    success,\n    element(element),\n  };\n}\n\nfunction fillElement(locator, value) {\n  const element = findElement(locator);\n\n  if (!element) {\n    return {\n      success,\n      error: `Element not found: ${JSON.stringify(locator)}`,\n    };\n  }\n\n  if (!['INPUT', 'TEXTAREA'].includes(element.tagName)) {\n    return {\n      success,\n      error: `Element is not an input or textarea: ${element.tagName}`,\n    };\n  }\n\n  const input = element ;\n\n  input.value = '';\n  input.value = value;\n\n  input.dispatchEvent(new Event('input', { bubbles }));\n  input.dispatchEvent(new Event('change', { bubbles }));\n\n  return {\n    success,\n    element(element),\n  };\n}\n\nfunction typeElement(locator, text) {\n  const element = findElement(locator);\n\n  if (!element) {\n    return {\n      success,\n      error: `Element not found: ${JSON.stringify(locator)}`,\n    };\n  }\n\n  if (!['INPUT', 'TEXTAREA'].includes(element.tagName)) {\n    return {\n      success,\n      error: `Element is not an input or textarea: ${element.tagName}`,\n    };\n  }\n\n  const input = element ;\n  input.focus();\n\n  for (const char of text) {\n    input.value += char;\n    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles }));\n    input.dispatchEvent(new KeyboardEvent('keypress', { key, bubbles }));\n    input.dispatchEvent(new Event('input', { bubbles }));\n    input.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles }));\n  }\n\n  return {\n    success,\n    element(element),\n  };\n}\n\nfunction selectOption(locator, option) {\n  const element = findElement(locator);\n\n  if (!element) {\n    return {\n      success,\n      error: `Element not found: ${JSON.stringify(locator)}`,\n    };\n  }\n\n  if (element.tagName !== 'SELECT') {\n    return {\n      success,\n      error: `Element is not a select: ${element.tagName}`,\n    };\n  }\n\n  const select = element ;\n  const options = Array.from(select.options);\n\n  const optionEl = options.find(\n    (o) => o.text === option || o.value === option\n  );\n\n  if (!optionEl) {\n    const available = options.map((o) => o.text).join(', ');\n    return {\n      success,\n      error: `Option not found: \"${option}\". Available: ${available}`,\n    };\n  }\n\n  select.value = optionEl.value;\n  select.dispatchEvent(new Event('change', { bubbles }));\n\n  return {\n    success,\n    element(element),\n  };\n}\n\n\n  \n\nlet nodeIdCounter = 0;\n\nfunction getSemanticType(el) {\n  const tag = el.tagName.toLowerCase();\n  const role = el.getAttribute('role');\n\n  if (role) {\n    return role;\n  }\n\n  const typeMap<string, string> = {\n    nav: 'navigation',\n    header: 'header',\n    footer: 'footer',\n    main: 'main',\n    aside: 'aside',\n    section: 'section',\n    article: 'article',\n    form: 'form',\n    button: 'button',\n    a: 'link',\n    input(el ),\n    select: 'select',\n    textarea: 'textbox',\n    h1: 'heading',\n    h2: 'heading',\n    h3: 'heading',\n    h4: 'heading',\n    h5: 'heading',\n    h6: 'heading',\n    ul: 'list',\n    ol: 'list',\n    li: 'listitem',\n    img: 'image',\n    dialog: 'dialog',\n  };\n\n  return typeMap[tag] || tag;\n}\n\nfunction getInputType(input) {\n  const type = input.type || 'text';\n  const typeMap<string, string> = {\n    text: 'textbox',\n    search: 'searchbox',\n    email: 'textbox',\n    password: 'textbox',\n    tel: 'textbox',\n    url: 'textbox',\n    number: 'textbox',\n    date: 'datepicker',\n    time: 'timepicker',\n    datetime: 'datepicker',\n    'datetime-local': 'datepicker',\n    month: 'datepicker',\n    week: 'datepicker',\n    checkbox: 'checkbox',\n    radio: 'radio',\n    button: 'button',\n    submit: 'button',\n    reset: 'button',\n  };\n\n  return typeMap[type] || 'textbox';\n}\n\nfunction isInteractive(el) {\n  const tag = el.tagName.toLowerCase();\n  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'label'];\n\n  if (interactiveTags.includes(tag)) {\n    return true;\n  }\n\n  const role = el.getAttribute('role');\n  const interactiveRoles = [\n    'button',\n    'link',\n    'tab',\n    'menuitem',\n    'option',\n    'checkbox',\n    'radio',\n    'textbox',\n    'searchbox',\n    'combobox',\n  ];\n\n  if (role && interactiveRoles.includes(role)) {\n    return true;\n  }\n\n  if (el.getAttribute('onclick') || el.getAttribute('ng-click')) {\n    return true;\n  }\n\n  return false;\n}\n\nfunction getElementLabel(el)= el.getAttribute('aria-label');\n  if (ariaLabel) {\n    return ariaLabel;\n  }\n\n  const ariaLabelledBy = el.getAttribute('aria-labelledby');\n  if (ariaLabelledBy) {\n    const labelEl = document.getElementById(ariaLabelledBy);\n    if (labelEl) {\n      return labelEl.textContent?.trim();\n    }\n  }\n\n  if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {\n    const id = el.id;\n    if (id) {\n      const label = document.querySelector(`label[for=\"${id}\"]`);\n      if (label) {\n        return label.textContent?.trim();\n      }\n    }\n\n    const parentLabel = el.closest('label');\n    if (parentLabel) {\n      const clone = parentLabel.cloneNode(true) ;\n      const input = clone.querySelector('input, select, textarea');\n      if (input) {\n        input.remove();\n      }\n      return clone.textContent?.trim();\n    }\n  }\n\n  if (el.tagName === 'LABEL') {\n    return (el ).textContent?.trim();\n  }\n\n  return undefined;\n}\n\nfunction getVisibleText(el)= el.cloneNode(true) ;\n\n  const toRemove = clone.querySelectorAll('script, style, [hidden]');\n  toRemove.forEach((n) => n.remove());\n\n  const text = clone.textContent?.trim();\n  if (!text) {\n    return undefined;\n  }\n\n  return text.length > 50 ? text.substring(0, 50) ;\n}\n\nfunction buildNode(el, depth, maxDepth) {\n  if (depth > maxDepth) {\n    return null;\n  }\n\n  const type = getSemanticType(el);\n  const interactive = isInteractive(el);\n\n  const node = { type };\n\n  if (interactive) {\n    node.id = ++nodeIdCounter;\n  }\n\n  const label = getElementLabel(el);\n  if (label) {\n    node.label = label;\n  }\n\n  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {\n    const input = el ;\n    if (input.value) {\n      node.value = input.value;\n    }\n    if (input.placeholder) {\n      node.placeholder = input.placeholder;\n    }\n  }\n\n  if (el.tagName === 'SELECT') {\n    const select = el ;\n    const selected = select.options[select.selectedIndex];\n    if (selected) {\n      node.value = selected.text;\n    }\n  }\n\n  if (el.tagName === 'A') {\n    const anchor = el ;\n    if (anchor.href) {\n      node.href = anchor.href;\n    }\n  }\n\n  if (el.tagName === 'BUTTON') {\n    const button = el ;\n    if (button.type === 'submit' || button.classList.contains('primary')) {\n      node.primary = true;\n    }\n  }\n\n  if (el.classList.contains('active') || el.getAttribute('aria-current') === 'page') {\n    node.active = true;\n  }\n\n  const children = [];\n  for (const child of Array.from(el.children)) {\n    const childNode = buildNode(child, depth + 1, maxDepth);\n    if (childNode) {\n      children.push(childNode);\n    }\n  }\n\n  if (children.length > 0) {\n    node.children = children;\n  } else {\n    const text = getVisibleText(el);\n    if (text) {\n      if (type === 'text' || type === 'p' || type === 'span' || type === 'div') {\n        node.content = text;\n      } else {\n        node.text = text;\n      }\n    }\n  }\n\n  if (!interactive && children.length === 0 && !node.text && !node.content && depth > 0) {\n    return null;\n  }\n\n  return node;\n}\n\nfunction getPageStructure(maxDepth = 10) {\n  nodeIdCounter = 0;\n\n  const tree = buildNode(document.body, 0, maxDepth);\n\n  return {\n    page.title,\n    url.location.href,\n    tree,\n  };\n}\n\n\n  // Return results as JSON\n  window.__arcMCPResult = function(result) {\n    return JSON.stringify(result);\n  };\n})();";

// ../browser/dist/api.js
async function executeBrowserAction(actionFn, args, tabId) {
  const code = `
    ${BROWSER_BUNDLE}
    ${actionFn}(${args})
  `;
  const result = await executeArcJavaScript(code, { tabId: tabId?.toString() });
  return JSON.parse(result);
}
async function click(locator, options = {}) {
  return executeBrowserAction("clickElement", JSON.stringify(locator), options.tab_id);
}
async function fill(locator, value, options = {}) {
  return executeBrowserAction("fillElement", `${JSON.stringify(locator)}, ${JSON.stringify(value)}`, options.tab_id);
}
async function type(locator, text, options = {}) {
  return executeBrowserAction("typeElement", `${JSON.stringify(locator)}, ${JSON.stringify(text)}`, options.tab_id);
}
async function selectOption(locator, option, options = {}) {
  return executeBrowserAction("selectOption", `${JSON.stringify(locator)}, ${JSON.stringify(option)}`, options.tab_id);
}
async function getPageStructure(maxDepth = 10, tabId) {
  const code = `
    ${BROWSER_BUNDLE}
    JSON.stringify(getPageStructure(${maxDepth}))
  `;
  const result = await executeArcJavaScript(code, { tabId: tabId?.toString() });
  return JSON.parse(result);
}

// src/index.ts
var server = new Server(
  {
    name: "arc-mcp",
    version: "2.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "execute",
        description: "Execute Node.js code with Arc browser automation functions available. Available functions: browser.click(locator, options?), browser.fill(locator, value, options?), browser.type(locator, text, options?), browser.selectOption(locator, option, options?), browser.getPageStructure(maxDepth?, tabId?), browser.openUrl(url, newTab?), browser.getCurrentTab(), browser.listTabs(), browser.closeTab(tabId), browser.switchToTab(tabId), browser.reloadTab(tabId?), browser.goBack(tabId?), browser.goForward(tabId?), browser.executeJavaScript(code, tabId?). Locator types: { role: { role: string, name?: string } } | { label: string } | { text: string } | { placeholder: string } | { css: string }",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Node.js code to execute (async/await supported)"
            }
          },
          required: ["code"]
        }
      }
    ]
  };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const safeArgs = args ?? {};
  try {
    if (name !== "execute") {
      throw new Error(`Unknown tool: ${name}`);
    }
    ensureArcRunning();
    const { code } = safeArgs;
    const fn = AsyncFunction("browser", code);
    const result = await fn(dist_exports);
    const output = result === void 0 ? "undefined" : typeof result === "string" ? result : JSON.stringify(result, null, 2);
    return {
      content: [{ type: "text", text: output }]
    };
  } catch (error) {
    const err = error;
    return {
      content: [
        {
          type: "text",
          text: `Error: ${err.message}
${err.stack || ""}`
        }
      ],
      isError: true
    };
  }
});
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
