<div align="center">

![Arc MCP](.github/header.svg)

**Control Arc browser through Claude Desktop**

<p>
<img src="https://raw.githubusercontent.com/anthropics/anthropic-sdk-python/main/assets/claude-logo.png" alt="Claude" height="20" />
<img src="https://mintlify.s3.us-west-1.amazonaws.com/anthropic/logo/Claude-Code-Logo.svg" alt="Claude Code" height="20" />
</p>

[![Build](https://github.com/andrewgazelka/arc-mcp/actions/workflows/build.yml/badge.svg)](https://github.com/andrewgazelka/arc-mcp/actions/workflows/build.yml)

</div>

## Installation

Download the latest `.mcpb` from [releases](https://github.com/andrewgazelka/arc-mcp/releases), then in Claude Desktop:

**Settings → Extensions → Install Extension**

## What You Can Do

```
"Open github.com in Arc"
"List all my tabs"
"Get the page content"
"Execute document.title in the current tab"
"Close tab 3"
```

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
