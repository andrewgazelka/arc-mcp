<div align="center">

![Arc MCP](.github/header.svg)

**Control Arc browser through Claude Desktop**

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

<table>
<tr>
<td width="50%">

**✈️ Flight Search**
```
"Open Google Flights"
"Click the departure city field"
"Find the cheapest flight to Tokyo"
```

</td>
<td width="50%">

**🛒 Shopping**
```
"Search Amazon for wireless headphones"
"Click on the first result"
"Add to cart"
```

</td>
</tr>
<tr>
<td>

**🥗 Groceries**
```
"Open Instacart"
"Get the DOM tree to find products"
"Add items to my cart"
```

</td>
<td>

**📊 Research**
```
"Open 5 tabs for competitor analysis"
"Extract content from each tab"
"Summarize key features"
```

</td>
</tr>
</table>

## Tools

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
| `execute_javascript` | Run JS in tab |
| `get_page_content` | Extract page text |
| `click_element` | Click element by CSS selector |
| `get_dom_tree` | Get simplified interactive DOM tree |

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
