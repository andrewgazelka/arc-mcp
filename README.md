<div align="center">

![Arc MCP](.github/header.svg)

**Playwright-style semantic browser automation for Arc**

<p>
<img src=".github/assets/claude-logo.svg" alt="Claude" height="20" />
</p>

[![Build](https://github.com/andrewgazelka/arc-mcp/actions/workflows/build.yml/badge.svg)](https://github.com/andrewgazelka/arc-mcp/actions/workflows/build.yml)

</div>

## Installation

1. Download the latest `.mcpb` file from [releases](https://github.com/andrewgazelka/arc-mcp/releases)
2. Open Claude Desktop
3. Go to **Settings → Extensions**
4. **Drag and drop** the `.mcpb` file onto the window where it says "Drag .MCPB or .DXT files here to install"

That's it! The extension will be installed and ready to use.

## Use Cases

<img src=".github/assets/icon-flight.svg" width="16" height="16" /> **Flight Search** — Compare prices across airlines, check availability, book tickets

<img src=".github/assets/icon-shopping.svg" width="16" height="16" /> **Shopping** — Search products, read reviews, add to cart, checkout

<img src=".github/assets/icon-groceries.svg" width="16" height="16" /> **Groceries** — Navigate store catalog, build cart, schedule delivery

<img src=".github/assets/icon-research.svg" width="16" height="16" /> **Research** — Open multiple sources, extract data, synthesize information

## Features

### Semantic Locators
Find elements the way users see them — by role, label, text, or placeholder. No more fragile CSS selectors.

```json
{
  "tool": "click",
  "arguments": {
    "role": { "role": "button", "name": "Search" }
  }
}
```

### Smart DOM Tree
Get a structured, semantic representation of the page with only interactive elements.

```json
{
  "tool": "get_page_structure",
  "arguments": { "max_depth": 10 }
}
```

## Semantic Actions

| Tool | Description | Example |
|------|-------------|---------|
| `click` | Click by role, label, text, placeholder, or CSS | `{ "role": { "role": "button", "name": "Search" } }` |
| `fill` | Fast fill input (replaces entire value) | `{ "label": "Email", "value": "user@example.com" }` |
| `type` | Type character-by-character (triggers autocomplete) | `{ "placeholder": "Where to?", "text_to_type": "London" }` |
| `select_option` | Select dropdown option by text or value | `{ "label": "Country", "option": "United Kingdom" }` |
| `get_page_structure` | Get semantic DOM tree with interactive elements | `{ "max_depth": 10 }` |

## Navigation & Tab Management

| Tool | Description |
|------|-------------|
| `open_url` | Open URLs in new or current tab |
| `get_current_tab` | Get active tab info |
| `list_tabs` | List all open tabs |
| `close_tab` | Close tab by ID |
| `switch_to_tab` | Switch to tab by ID |
| `reload_tab` | Reload tab |
| `go_back` | Navigate back |
| `go_forward` | Navigate forward |
| `execute_javascript` | Run arbitrary JavaScript |

## Example Workflow

```json
[
  { "tool": "open_url", "arguments": { "url": "https://www.google.com/travel/flights" } },
  { "tool": "fill", "arguments": { "label": "Where from?", "value": "San Francisco" } },
  { "tool": "type", "arguments": { "placeholder": "Where to?", "text_to_type": "London" } },
  { "tool": "click", "arguments": { "role": { "role": "button", "name": "Search" } } }
]
```

## Requirements

- macOS
- Arc browser

## Build

```bash
npm install
npm run build
npm run pack
```

---

<div align="center">

*Not affiliated with The Browser Company. Arc is a trademark of The Browser Company.*

**MIT** · [Andrew Gazelka](https://github.com/andrewgazelka)

</div>
