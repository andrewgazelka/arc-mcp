# @arc-mcp/browser

High-level Node.js API for Arc browser automation with Playwright-style semantic locators.

## Installation

```bash
npm install @arc-mcp/browser
```

## Features

- **Semantic Locators**: Find elements by role, label, text, placeholder, or CSS selector
- **Browser Actions**: Click, fill, type, select with automatic event dispatch
- **Navigation**: Open URLs, switch tabs, navigate history
- **Page Structure**: Extract interactive elements as a tree
- **Tab Management**: List, switch, close, and reload tabs

## Usage

### Semantic Actions

```typescript
import * as browser from '@arc-mcp/browser';

// Click by ARIA role
await browser.click({ role: { role: 'button', name: 'Submit' } });

// Fill input by label
await browser.fill({ label: 'Email' }, 'user@example.com');

// Type character-by-character (triggers autocomplete)
await browser.type({ placeholder: 'Search...' }, 'hello world');

// Select dropdown option
await browser.selectOption({ label: 'Country' }, 'United States');

// Click by text content
await browser.click({ text: 'Sign Up' });

// Fallback to CSS selector
await browser.click({ css: '#submit-button' });
```

### Navigation

```typescript
// Open URL
await browser.openUrl('https://example.com');
await browser.openUrl('https://example.com', false); // in current tab

// Get current tab
const tab = await browser.getCurrentTab();
console.log(tab.title, tab.url);

// List all tabs
const tabs = await browser.listTabs();
tabs.forEach((tab) => console.log(tab.id, tab.title));

// Switch to tab by index (1-based)
await browser.switchToTab(2);

// Close tab
await browser.closeTab(3);

// Navigate
await browser.goBack();
await browser.goForward();
await browser.reloadTab();
```

### Page Structure

```typescript
// Get page structure with interactive elements
const structure = await browser.getPageStructure(10); // max depth 10
console.log(JSON.stringify(structure, null, 2));
```

### Low-Level JavaScript Execution

```typescript
// Execute arbitrary JavaScript
const title = await browser.executeJavaScript('document.title');

// In specific tab
const result = await browser.executeJavaScript('window.location.href', 2);
```

## API

### Semantic Actions

All semantic actions accept a `LocatorStrategy` and optional `ActionOptions`:

```typescript
type LocatorStrategy =
  | { role: { role: string; name?: string } }
  | { label: string }
  | { text: string }
  | { placeholder: string }
  | { css: string };

interface ActionOptions {
  tab_id?: number; // 1-based tab index
  timeout?: number;
}
```

#### `click(locator, options?)`
Click an element.

#### `fill(locator, value, options?)`
Fill an input field (fast, replaces entire value).

#### `type(locator, text, options?)`
Type text character-by-character (triggers autocomplete/validation).

#### `selectOption(locator, option, options?)`
Select a dropdown option by text or value.

### Navigation

#### `openUrl(url, newTab?)`
Open a URL in Arc browser.

#### `getCurrentTab()`
Get current tab info (title, URL).

#### `listTabs()`
List all tabs with ID, title, and URL.

#### `switchToTab(tabId)`
Switch to tab by index (1-based).

#### `closeTab(tabId)`
Close tab by index.

#### `reloadTab(tabId?)`
Reload tab (current if not specified).

#### `goBack(tabId?)` / `goForward(tabId?)`
Navigate browser history.

### Page Analysis

#### `getPageStructure(maxDepth?, tabId?)`
Get page DOM tree with interactive elements.

### Low-Level

#### `executeJavaScript(code, tabId?)`
Execute arbitrary JavaScript in a tab.

#### `ensureArcRunning()`
Throws if Arc browser is not running.

## Architecture

This package consists of three layers:

1. **AppleScript Bridge** (`@arc-mcp/applescript`)
   - Low-level JavaScript execution via AppleScript
   - Base64 encoding to avoid escaping issues

2. **Browser Actions** (this package)
   - Semantic locator engine (finds elements by role/label/text)
   - Bundled DOM code injected into browser
   - High-level functions wrapping AppleScript calls

3. **Navigation & Tabs**
   - Pure AppleScript for tab management
   - These operations can't be done via browser JavaScript

## Implementation Details

### How Actions Work

1. Your code calls `browser.click({ role: 'button' })`
2. The function bundles DOM code + locator logic
3. Sends to Arc via AppleScript's `execute javascript`
4. Browser finds element and clicks it
5. Result returns to Node.js

### Why Separate Packages?

- `@arc-mcp/applescript`: Reusable low-level bridge
- `@arc-mcp/browser`: High-level API for any Node.js app
- `arc-mcp-server`: Thin MCP wrapper exposing REPL

This allows using the browser API in standalone scripts or building custom tools.
