<div align="center">

![Arc MCP](.github/header.svg)

**Playwright-style semantic browser automation for Arc**

<p>
<img src=".github/assets/claude-logo.svg" alt="Claude" height="20" />
</p>

[![Build](https://github.com/andrewgazelka/arc-mcp/actions/workflows/build.yml/badge.svg)](https://github.com/andrewgazelka/arc-mcp/actions/workflows/build.yml)

</div>

## Installation

### Claude Desktop

1. Download the latest `.mcpb` file from [releases](https://github.com/andrewgazelka/arc-mcp/releases)
2. Open Claude Desktop
3. Go to **Settings → Extensions**
4. **Drag and drop** the `.mcpb` file onto the window

### Claude Code

```bash
claude mcp add --scope user --transport stdio arc bunx github:andrewgazelka/arc-mcp
```

Or manually add to your MCP settings:

```json
{
  "mcpServers": {
    "arc": {
      "command": "bunx",
      "args": ["github:andrewgazelka/arc-mcp"]
    }
  }
}
```

## Use Cases

<img src=".github/assets/icon-flight.svg" width="16" height="16" /> **Flight Search** — Compare prices across airlines, check availability, book tickets

<img src=".github/assets/icon-shopping.svg" width="16" height="16" /> **Shopping** — Search products, read reviews, add to cart, checkout

<img src=".github/assets/icon-groceries.svg" width="16" height="16" /> **Groceries** — Navigate store catalog, build cart, schedule delivery

<img src=".github/assets/icon-research.svg" width="16" height="16" /> **Research** — Open multiple sources, extract data, synthesize information

## Features

### Node.js REPL
Execute automation scripts with full access to the browser API — no predefined tool constraints.

```javascript
await browser.click({ role: { role: 'button', name: 'Search' } });
await browser.fill({ label: 'Email' }, 'user@example.com');
const tabs = await browser.listTabs();
return tabs.length;
```

### Semantic Locators
Find elements the way users see them — by role, label, text, or placeholder. No more fragile CSS selectors.

```javascript
await browser.click({ role: { role: 'button', name: 'Search' } });
await browser.fill({ label: 'Email' }, 'user@example.com');
await browser.type({ placeholder: 'Search...' }, 'London');
```

### Smart DOM Tree
Get a structured, semantic representation of the page with only interactive elements.

```javascript
const structure = await browser.getPageStructure(10);
```

## Available Functions

The `browser` object provides:

**Semantic Actions**:
- `click(locator, options?)` — Click element by role, label, text, placeholder, or CSS
- `fill(locator, value, options?)` — Fast fill (replaces entire value)
- `type(locator, text, options?)` — Type character-by-character (triggers autocomplete)
- `selectOption(locator, option, options?)` — Select dropdown option

**Navigation**:
- `openUrl(url, newTab?)` — Open URL in new or current tab
- `getCurrentTab()` — Get active tab info (title, URL)
- `listTabs()` — List all open tabs
- `switchToTab(tabId)` — Switch to tab by index
- `closeTab(tabId)` — Close tab by index
- `reloadTab(tabId?)` — Reload tab
- `goBack(tabId?)` — Navigate back
- `goForward(tabId?)` — Navigate forward

**Page Analysis**:
- `getPageStructure(maxDepth?, tabId?)` — Get semantic DOM tree

**Low-Level**:
- `executeJavaScript(code, tabId?)` — Run arbitrary JavaScript

## Example Workflow

```javascript
// Open Google Flights
await browser.openUrl('https://www.google.com/travel/flights');

// Fill origin
await browser.fill({ label: 'Where from?' }, 'San Francisco');

// Type destination (triggers autocomplete)
await browser.type({ placeholder: 'Where to?' }, 'London');

// Click search
await browser.click({ role: { role: 'button', name: 'Search' } });
```

## Architecture

This is a monorepo with three packages:

- **@arc-mcp/applescript** — Low-level AppleScript bridge for Arc
- **@arc-mcp/browser** — High-level Node.js API with semantic locators
- **arc-mcp-server** — MCP server exposing REPL

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design.

## Requirements

- macOS
- Arc browser

## Development

```bash
npm install
npm run build        # Build all packages
npm run typecheck    # Type check all packages
npm run pack         # Create .mcpb bundle
```

## Package Usage

Each package can be used independently:

```bash
# Use browser API in your own scripts
npm install @arc-mcp/browser

# Use AppleScript bridge directly
npm install @arc-mcp/applescript
```

---

<div align="center">

*Not affiliated with The Browser Company. Arc is a trademark of The Browser Company.*

**MIT** · [Andrew Gazelka](https://github.com/andrewgazelka)

</div>
