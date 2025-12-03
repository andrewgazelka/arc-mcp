# Arc Browser MCP

An MCPB extension for controlling Arc browser using AppleScript through the Model Context Protocol.

## Features

This MCP server provides 10 tools for programmatic Arc browser control:

1. **open_url** - Open URLs in Arc (new tab or current)
2. **get_current_tab** - Get info about the active tab (title, URL)
3. **list_tabs** - List all open tabs
4. **close_tab** - Close a specific tab by ID
5. **switch_to_tab** - Switch to a specific tab by ID
6. **reload_tab** - Reload a tab (current or by ID)
7. **go_back** - Navigate back in history
8. **go_forward** - Navigate forward in history
9. **execute_javascript** - Run arbitrary JavaScript in a tab
10. **get_page_content** - Extract text content from a page

## Installation

### From .mcpb File

1. Download `arc-mcp-0.1.0.mcpb`
2. Open Claude Desktop
3. Go to Settings > Extensions
4. Click "Install Extension"
5. Select the downloaded `.mcpb` file

### From Source

```bash
bun install
bun run build
bunx @anthropic-ai/mcpb pack
```

This will generate `arc-mcp-0.1.0.mcpb` which you can install in Claude Desktop.

## Requirements

- macOS (requires AppleScript)
- Arc browser installed and running
- Node.js runtime (bundled in the MCPB)

## Usage

Once installed in Claude Desktop, you can ask Claude to control your Arc browser:

- "Open https://github.com in Arc"
- "List all my open tabs in Arc"
- "Execute JavaScript to get the page title"
- "Get the text content of the current page"
- "Close tab 3"

## Development

```bash
# Install dependencies
bun install

# Build TypeScript
bun run build

# Package as MCPB
bun run pack
```

## Technical Details

This extension uses AppleScript's `osascript` command to control Arc browser. The MCP server runs as a Node.js process and communicates with Claude Desktop via stdio transport.

### Tools Implementation

All tools check that Arc is running before executing commands. AppleScript commands are wrapped with proper error handling and return structured responses.

### Arc Browser AppleScript Support

Arc exposes a rich AppleScript API that allows:
- Tab management (create, close, switch, reload)
- JavaScript execution within tabs
- Navigation control (back/forward)
- Access to tab properties (URL, title)

## License

MIT

## Author

Andrew Gazelka
