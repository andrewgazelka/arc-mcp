# Architecture

## Overview

arc-mcp is a monorepo with three packages forming a layered architecture:

```
packages/
├── applescript/     - Low-level AppleScript bridge
├── browser/        - High-level browser automation API
└── server/         - MCP server exposing REPL
```

## Layer 1: @arc-mcp/applescript

**Purpose**: Execute JavaScript in Arc browser tabs via AppleScript

**Key Function**:
```typescript
executeArcJavaScript(code: string, options?: {
  tabId?: string,
  timeout?: number
}): Promise<any>
```

**How it Works**:
1. Takes JavaScript code as input
2. Base64-encodes it to avoid escaping issues
3. Builds AppleScript that:
   - Selects the target tab (by index or active)
   - Decodes base64 using shell command
   - Executes via Arc's `execute javascript` command
4. Returns result (parsed as JSON if possible)

**Why Base64?**:
- AppleScript string escaping is complex
- JavaScript often contains quotes, backslashes, newlines
- Base64 eliminates all escaping edge cases

**Example**:
```typescript
const title = await executeArcJavaScript('document.title', { tabId: '2' });
```

## Layer 2: @arc-mcp/browser

**Purpose**: High-level browser automation with semantic locators

**Exports**:
- Semantic actions: `click()`, `fill()`, `type()`, `selectOption()`
- Navigation: `openUrl()`, `getCurrentTab()`, `listTabs()`
- Tab management: `switchToTab()`, `closeTab()`, `reloadTab()`
- Page analysis: `getPageStructure()`
- Low-level: `executeJavaScript()`

**How Semantic Actions Work**:

1. **Browser-side code** (`src/browser/`):
   - `actions.ts`: Functions that run IN the browser
   - `locator.ts`: Element-finding logic (by role, label, text, etc.)
   - `domtree.ts`: Page structure extraction
   - `build.ts`: Bundles these into a single string

2. **Node.js wrapper** (`src/api.ts`):
   ```typescript
   async function click(locator, options) {
     const code = `
       ${BROWSER_BUNDLE}
       clickElement(${JSON.stringify(locator)})
     `;
     return await executeArcJavaScript(code, { tabId: options.tab_id });
   }
   ```

3. **Flow**:
   ```
   User calls: browser.click({ role: 'button' })
        ↓
   Bundles: DOM code + locator + clickElement()
        ↓
   Sends to Arc via AppleScript
        ↓
   Browser executes bundled code
        ↓
   Finds element by role
        ↓
   Dispatches click events
        ↓
   Returns success to Node.js
   ```

**Navigation Functions**:

These use **pure AppleScript** (not browser JavaScript) because operations like creating tabs, switching tabs, etc. can't be done via JavaScript:

```typescript
async function openUrl(url, newTab = true) {
  const script = newTab
    ? `tell application "Arc" to make new tab with properties {URL:"${url}"}`
    : `tell application "Arc" to open location "${url}"`;
  executeAppleScript(script);
}
```

**Tab IDs**:
- Arc tabs are referenced by **1-based index**, not UUID
- `tab 1` = first tab, `tab 2` = second tab, etc.
- `active tab` = currently focused tab

## Layer 3: arc-mcp-server

**Purpose**: Expose browser API to MCP clients via REPL

**Key Design**: Single `execute` tool instead of 15+ individual tools

**Implementation**:

```typescript
import * as browser from '@arc-mcp/browser';

// Create async function from user code
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const fn = AsyncFunction('browser', userCode);

// Execute with browser in scope
const result = await fn(browser);
```

**Why REPL?**:
- **Flexibility**: Users can write loops, conditionals, complex logic
- **Composability**: Combine multiple actions in one call
- **Better for LLMs**: Modern LLMs excel at code generation
- **Simpler server**: One tool instead of 15+ with rigid schemas

**Example MCP Call**:
```json
{
  "tool": "execute",
  "arguments": {
    "code": "const tab = await browser.getCurrentTab(); return tab.title;"
  }
}
```

## Data Flow Example

User in Claude: "Click the Sign Up button"

```
1. Claude calls MCP tool:
   execute({
     code: "await browser.click({ role: { role: 'button', name: 'Sign Up' } })"
   })

2. arc-mcp-server REPL:
   - Creates AsyncFunction with 'browser' in scope
   - Executes: await browser.click(...)

3. @arc-mcp/browser click():
   - Bundles: BROWSER_BUNDLE + clickElement({ role: 'button' })
   - Calls: executeArcJavaScript(code, { tabId: undefined })

4. @arc-mcp/applescript executeArcJavaScript():
   - Base64 encodes the bundled code
   - Builds AppleScript:
     tell application "Arc"
       tell active tab
         execute javascript "eval(atob('...'))"
       end tell
     end tell
   - Executes via osascript

5. Arc Browser:
   - Decodes base64
   - Runs bundled JavaScript
   - findElement() locates button by ARIA role
   - clickElement() dispatches mouse events
   - Returns: { success: true, element: '<button>Sign Up</button>' }

6. Result flows back:
   executeArcJavaScript -> click() -> REPL -> MCP -> Claude
```

## Why This Architecture?

### Separation of Concerns
- **applescript**: Pure AppleScript bridge (reusable)
- **browser**: Business logic (semantic locators, DOM manipulation)
- **server**: MCP protocol (thin wrapper)

### Reusability
Each package can be used independently:
- Want to build custom automation? Use `@arc-mcp/browser`
- Need just AppleScript bridge? Use `@arc-mcp/applescript`
- Want MCP server? Use `arc-mcp-server`

### Testability
- AppleScript layer is minimal (hard to test)
- Browser logic is pure JavaScript (easy to test)
- Server is just REPL wrapper (easy to test)

### Flexibility
- REPL allows complex scripting
- Not limited to predefined MCP tools
- LLMs can generate sophisticated automation

## Build System

**Workspace**: npm workspaces in monorepo

**Dependencies**:
```
server → browser → applescript
```

**Build Order**:
```bash
npm run build
# Runs:
# 1. @arc-mcp/applescript: tsc
# 2. @arc-mcp/browser: node build.ts (bundles DOM code) + tsc
# 3. arc-mcp-server: esbuild (bundles for distribution)
```

**Browser Bundle**:
```typescript
// packages/browser/src/build.ts
import { bundle } from 'esbuild';

// Bundles actions.ts, locator.ts, domtree.ts
// Into single string: BROWSER_BUNDLE
// Written to: src/bundle-export.ts

// This gets imported by api.ts and injected into browser
```

## Type System

All packages share types via exports:

```typescript
// @arc-mcp/applescript
export interface ExecuteOptions {
  tabId?: string;
  timeout?: number;
}

// @arc-mcp/browser
export type LocatorStrategy = { role: { role: string, name?: string } } | ...
export interface ActionOptions { tab_id?: number; timeout?: number; }
export interface ActionResult { success: boolean; error?: string; element?: string; }
export interface TabInfo { id?: number; title: string; url: string; }

// arc-mcp-server
// No exported types (internal only)
```

## Future Extensions

Possible additions without breaking architecture:

1. **New actions**: Add to browser package
   - e.g., `browser.hover()`, `browser.dragAndDrop()`

2. **New navigation**: Add to browser package
   - e.g., `browser.screenshot()`, `browser.cookies()`

3. **Other browsers**: New applescript package
   - e.g., `@arc-mcp/safari`, `@arc-mcp/chrome`

4. **Other protocols**: New server package
   - e.g., `arc-http-server`, `arc-grpc-server`

All without changing core architecture!
