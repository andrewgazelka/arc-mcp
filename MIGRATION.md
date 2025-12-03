# Migration Guide: v1 → v2

## Overview

Version 2.0 completely redesigns arc-mcp with a **REPL-based architecture**. Instead of 15+ individual MCP tools, you now get a single `execute` tool that runs Node.js code.

## Breaking Changes

### 1. Single REPL Tool

**Before (v1):**
```json
{
  "tool": "click",
  "arguments": {
    "role": { "role": "button", "name": "Submit" }
  }
}
```

**After (v2):**
```json
{
  "tool": "execute",
  "arguments": {
    "code": "await browser.click({ role: { role: 'button', name: 'Submit' } })"
  }
}
```

### 2. Function Names

| v1 Tool | v2 Function |
|---------|-------------|
| `click` | `browser.click()` |
| `fill` | `browser.fill()` |
| `type` | `browser.type()` |
| `select_option` | `browser.selectOption()` |
| `get_page_structure` | `browser.getPageStructure()` |
| `open_url` | `browser.openUrl()` |
| `get_current_tab` | `browser.getCurrentTab()` |
| `list_tabs` | `browser.listTabs()` |
| `close_tab` | `browser.closeTab()` |
| `switch_to_tab` | `browser.switchToTab()` |
| `reload_tab` | `browser.reloadTab()` |
| `go_back` | `browser.goBack()` |
| `go_forward` | `browser.goForward()` |
| `execute_javascript` | `browser.executeJavaScript()` |

### 3. Parameter Changes

**Options are now the last parameter:**

Before:
```json
{
  "tool": "click",
  "arguments": {
    "role": { "role": "button" },
    "tab_id": 2
  }
}
```

After:
```javascript
await browser.click({ role: { role: 'button' } }, { tab_id: 2 });
```

## Why This Change?

### Advantages of REPL

1. **Flexibility**: Write loops, conditionals, complex logic
2. **Composability**: Multiple actions in one call
3. **Better for LLMs**: Modern AI excels at code generation
4. **Simpler server**: One tool instead of 15+ rigid schemas

### Example: Complex Automation

**v1 (Impossible):**
You'd need multiple sequential tool calls, no way to loop or combine logic.

**v2 (Easy):**
```javascript
const tabs = await browser.listTabs();
for (const tab of tabs) {
  await browser.switchToTab(tab.id);
  const structure = await browser.getPageStructure(5);
  if (structure.interactiveElements.length > 10) {
    await browser.closeTab(tab.id);
  }
}
return 'Closed busy tabs';
```

## Migration Examples

### Example 1: Click and Fill

**v1:**
```json
[
  { "tool": "click", "arguments": { "text": "Sign Up" } },
  { "tool": "fill", "arguments": { "label": "Email", "value": "user@example.com" } },
  { "tool": "click", "arguments": { "role": { "role": "button", "name": "Submit" } } }
]
```

**v2:**
```javascript
await browser.click({ text: 'Sign Up' });
await browser.fill({ label: 'Email' }, 'user@example.com');
await browser.click({ role: { role: 'button', name: 'Submit' } });
```

### Example 2: Get Tab Info

**v1:**
```json
{ "tool": "get_current_tab", "arguments": {} }
```

**v2:**
```javascript
const tab = await browser.getCurrentTab();
return `${tab.title} - ${tab.url}`;
```

### Example 3: Navigate Multiple Pages

**v1 (Multiple calls):**
```json
[
  { "tool": "open_url", "arguments": { "url": "https://example.com" } },
  { "tool": "open_url", "arguments": { "url": "https://github.com" } },
  { "tool": "list_tabs", "arguments": {} }
]
```

**v2 (Single call):**
```javascript
await browser.openUrl('https://example.com');
await browser.openUrl('https://github.com');
const tabs = await browser.listTabs();
return tabs.map(t => t.title);
```

## New Capabilities

### 1. Loops

```javascript
const urls = ['https://a.com', 'https://b.com', 'https://c.com'];
for (const url of urls) {
  await browser.openUrl(url);
}
```

### 2. Conditionals

```javascript
const tab = await browser.getCurrentTab();
if (tab.url.includes('login')) {
  await browser.fill({ label: 'Username' }, 'admin');
  await browser.fill({ label: 'Password' }, 'secret');
  await browser.click({ role: { role: 'button', name: 'Sign In' } });
}
```

### 3. Error Handling

```javascript
try {
  await browser.click({ text: 'Sign Up' });
} catch (error) {
  // Fallback to CSS selector
  await browser.click({ css: '#signup-button' });
}
```

### 4. Complex Returns

```javascript
const tabs = await browser.listTabs();
const structures = await Promise.all(
  tabs.map(tab => browser.getPageStructure(5, tab.id))
);
return {
  tabCount: tabs.length,
  totalInteractiveElements: structures.reduce(
    (sum, s) => sum + s.interactiveElements.length,
    0
  )
};
```

## Package Architecture

v2 splits into three packages:

```
@arc-mcp/applescript     - AppleScript bridge
@arc-mcp/browser         - High-level API
arc-mcp-server          - MCP wrapper
```

You can now use the browser API in standalone scripts:

```bash
npm install @arc-mcp/browser
```

```typescript
import * as browser from '@arc-mcp/browser';

await browser.click({ role: { role: 'button' } });
```

## FAQ

### Q: Can I still use individual actions?

Yes! The REPL gives you the full `@arc-mcp/browser` API. Each function works exactly as before, just called via `browser.*` instead of separate tools.

### Q: Is it slower?

No. The REPL executes JavaScript immediately. In fact, it's often **faster** because you can combine multiple actions in one call instead of separate MCP round-trips.

### Q: What about type safety?

The `browser` object is fully typed. If you're generating code programmatically, you get all the TypeScript benefits.

### Q: Can I still use CSS selectors?

Yes! `{ css: 'selector' }` still works as a fallback locator.

### Q: What happened to tool schemas?

The MCP server now exposes one tool (`execute`) with a single `code` parameter. The schema is in the tool description showing available `browser.*` functions.

## Support

- **Issues**: https://github.com/andrewgazelka/arc-mcp/issues
- **Docs**: See package READMEs and ARCHITECTURE.md
- **Examples**: Check the main README for workflow examples
