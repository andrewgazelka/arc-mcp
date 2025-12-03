# arc-mcp-server

MCP server providing a Node.js REPL for Arc browser automation.

## Installation

Via npm:
```bash
npm install -g arc-mcp-server
```

Or via MCP Bundle:
```bash
npx @anthropic-ai/mcpb install arc-mcp.mcpb
```

## What is This?

This MCP server exposes a **single REPL tool** that runs Node.js code with `@arc-mcp/browser` functions available in scope.

Instead of exposing 15+ individual MCP tools (click, fill, type, etc.), users get:

```javascript
execute({
  code: `
    await browser.click({ role: { role: 'button', name: 'Sign Up' } });
    await browser.fill({ label: 'Email' }, 'test@example.com');
    const tabs = await browser.listTabs();
    return tabs.length;
  `
})
```

## Why a REPL?

**Traditional Approach** (what we replaced):
- Expose 15+ individual tools: `click`, `fill`, `type`, `selectOption`, etc.
- Each tool has rigid parameters
- No composability or scripting

**REPL Approach** (this server):
- Single `execute` tool
- Full Node.js environment
- Complete `@arc-mcp/browser` API available
- Users can write loops, conditionals, complex logic
- Better for AI agents (LLMs excel at code generation)

## Available API

The `browser` object in the REPL provides:

```typescript
// Semantic actions
browser.click(locator, options?)
browser.fill(locator, value, options?)
browser.type(locator, text, options?)
browser.selectOption(locator, option, options?)

// Navigation
browser.openUrl(url, newTab?)
browser.getCurrentTab()
browser.listTabs()
browser.switchToTab(tabId)
browser.closeTab(tabId)
browser.reloadTab(tabId?)
browser.goBack(tabId?)
browser.goForward(tabId?)

// Page analysis
browser.getPageStructure(maxDepth?, tabId?)

// Low-level
browser.executeJavaScript(code, tabId?)
browser.ensureArcRunning()
```

### Locator Types

```typescript
type Locator =
  | { role: { role: string, name?: string } }  // ARIA role
  | { label: string }                          // Associated label
  | { text: string }                           // Text content
  | { placeholder: string }                    // Placeholder attribute
  | { css: string }                            // CSS selector (fallback)
```

## Examples

### Click and Fill Form

```javascript
await browser.openUrl('https://example.com/signup');

await browser.fill({ label: 'Username' }, 'testuser');
await browser.fill({ label: 'Email' }, 'test@example.com');
await browser.fill({ placeholder: 'Password' }, 'secret123');

await browser.click({ role: { role: 'button', name: 'Create Account' } });
```

### Get All Tab Titles

```javascript
const tabs = await browser.listTabs();
return tabs.map(t => t.title);
```

### Find and Click with Fallback

```javascript
// Try semantic first, fall back to CSS
try {
  await browser.click({ text: 'Sign Up' });
} catch (e) {
  await browser.click({ css: '#signup-button' });
}
```

### Complex Automation

```javascript
// Open multiple tabs
for (const url of ['https://news.ycombinator.com', 'https://github.com']) {
  await browser.openUrl(url);
}

// Wait a bit
await new Promise(r => setTimeout(r, 2000));

// Get page structures
const tabs = await browser.listTabs();
const structures = [];
for (const tab of tabs) {
  structures.push(await browser.getPageStructure(5, tab.id));
}

return structures;
```

## Configuration

Add to your MCP settings (e.g., Claude Desktop config):

```json
{
  "mcpServers": {
    "arc": {
      "command": "arc-mcp"
    }
  }
}
```

Or if installed via MCP Bundle, it will auto-configure.

## Architecture

```
┌─────────────────────────────────────┐
│   arc-mcp-server (this package)     │
│   ┌───────────────────────────────┐ │
│   │  MCP Server (stdio)           │ │
│   │  ├─ execute(code)             │ │
│   │  └─ Returns: eval result      │ │
│   └───────────────────────────────┘ │
│              │                       │
│              ↓                       │
│   ┌───────────────────────────────┐ │
│   │  REPL Engine                  │ │
│   │  ├─ AsyncFunction(code)       │ │
│   │  └─ browser object in scope   │ │
│   └───────────────────────────────┘ │
│              │                       │
│              ↓                       │
│   ┌───────────────────────────────┐ │
│   │  @arc-mcp/browser             │ │
│   │  (imported as 'browser')      │ │
│   └───────────────────────────────┘ │
└─────────────────────────────────────┘
              │
              ↓
   ┌─────────────────────────┐
   │  @arc-mcp/applescript   │
   │  (AppleScript bridge)   │
   └─────────────────────────┘
              │
              ↓
        ┌──────────┐
        │   Arc    │
        │ Browser  │
        └──────────┘
```

## Development

Build:
```bash
npm run build
```

Typecheck:
```bash
npm run typecheck
```

Test locally:
```bash
node packages/server/dist/index.js
```

## License

MIT
