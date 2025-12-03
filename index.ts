#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";

/**
 * Execute AppleScript and return the result
 */
function executeAppleScript(script: string): string {
  try {
    const result = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      encoding: "utf-8",
    });
    return result.trim();
  } catch (error: any) {
    throw new Error(`AppleScript execution failed: ${error.message}`);
  }
}

/**
 * Check if Arc is running
 */
function ensureArcRunning(): void {
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

const server = new Server(
  {
    name: "arc-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "open_url",
        description: "Opens a URL in Arc browser",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to open",
            },
            new_tab: {
              type: "boolean",
              description: "Open in a new tab (default: true)",
              default: true,
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_current_tab",
        description: "Get information about the current active tab",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list_tabs",
        description: "List all open tabs in Arc",
        inputSchema: {
          type: "object",
          properties: {
            window_id: {
              type: "number",
              description: "Specific window ID to list tabs from (optional)",
            },
          },
        },
      },
      {
        name: "close_tab",
        description: "Close a specific tab",
        inputSchema: {
          type: "object",
          properties: {
            tab_id: {
              type: "number",
              description: "ID of the tab to close",
            },
          },
          required: ["tab_id"],
        },
      },
      {
        name: "switch_to_tab",
        description: "Switch to a specific tab",
        inputSchema: {
          type: "object",
          properties: {
            tab_id: {
              type: "number",
              description: "ID of the tab to switch to",
            },
          },
          required: ["tab_id"],
        },
      },
      {
        name: "reload_tab",
        description: "Reload a tab",
        inputSchema: {
          type: "object",
          properties: {
            tab_id: {
              type: "number",
              description: "ID of the tab to reload (optional, defaults to current)",
            },
          },
        },
      },
      {
        name: "go_back",
        description: "Navigate back in browser history",
        inputSchema: {
          type: "object",
          properties: {
            tab_id: {
              type: "number",
              description: "ID of the tab (optional, defaults to current)",
            },
          },
        },
      },
      {
        name: "go_forward",
        description: "Navigate forward in browser history",
        inputSchema: {
          type: "object",
          properties: {
            tab_id: {
              type: "number",
              description: "ID of the tab (optional, defaults to current)",
            },
          },
        },
      },
      {
        name: "execute_javascript",
        description: "Execute JavaScript in the current tab",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "JavaScript code to execute",
            },
            tab_id: {
              type: "number",
              description: "ID of the tab (optional, defaults to current)",
            },
          },
          required: ["code"],
        },
      },
      {
        name: "get_page_content",
        description: "Get the text content of the current page",
        inputSchema: {
          type: "object",
          properties: {
            tab_id: {
              type: "number",
              description: "ID of the tab (optional, defaults to current)",
            },
          },
        },
      },
      {
        name: "click_element",
        description: "Click an element on the page using a CSS selector",
        inputSchema: {
          type: "object",
          properties: {
            selector: {
              type: "string",
              description: "CSS selector for the element to click",
            },
            tab_id: {
              type: "number",
              description: "ID of the tab (optional, defaults to current)",
            },
          },
          required: ["selector"],
        },
      },
      {
        name: "get_dom_tree",
        description: "Get a simplified DOM tree of the current page showing interactive elements",
        inputSchema: {
          type: "object",
          properties: {
            max_depth: {
              type: "number",
              description: "Maximum depth to traverse (default: 5)",
              default: 5,
            },
            tab_id: {
              type: "number",
              description: "ID of the tab (optional, defaults to current)",
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    ensureArcRunning();

    switch (name) {
      case "open_url": {
        const { url, new_tab = true } = args as { url: string; new_tab?: boolean };
        const script = new_tab
          ? `tell application "Arc" to tell front window to make new tab with properties {URL:"${url}"}`
          : `tell application "Arc" to open location "${url}"`;
        executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: `Opened ${url} in ${new_tab ? "new tab" : "current tab"}`,
            },
          ],
        };
      }

      case "get_current_tab": {
        const script = `
          tell application "Arc"
            tell front window
              set currentTab to active tab
              set tabTitle to title of currentTab
              set tabURL to URL of currentTab
              return tabTitle & "|" & tabURL
            end tell
          end tell
        `;
        const result = executeAppleScript(script);
        const [title, url] = result.split("|");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ title, url }, null, 2),
            },
          ],
        };
      }

      case "list_tabs": {
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
        const tabs = result.split(", ").map((tab) => {
          const [id, title, url] = tab.split("|");
          return { id: parseInt(id), title, url };
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(tabs, null, 2),
            },
          ],
        };
      }

      case "close_tab": {
        const { tab_id } = args as { tab_id: number };
        const script = `
          tell application "Arc"
            tell front window
              close tab ${tab_id}
            end tell
          end tell
        `;
        executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: `Closed tab ${tab_id}`,
            },
          ],
        };
      }

      case "switch_to_tab": {
        const { tab_id } = args as { tab_id: number };
        const script = `
          tell application "Arc"
            tell front window
              set active tab to tab ${tab_id}
            end tell
          end tell
        `;
        executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: `Switched to tab ${tab_id}`,
            },
          ],
        };
      }

      case "reload_tab": {
        const { tab_id } = args as { tab_id?: number };
        const script = tab_id
          ? `tell application "Arc" to tell front window to reload tab ${tab_id}`
          : `tell application "Arc" to tell front window to reload active tab`;
        executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: `Reloaded tab${tab_id ? ` ${tab_id}` : ""}`,
            },
          ],
        };
      }

      case "go_back": {
        const script = `
          tell application "Arc"
            tell front window
              tell active tab
                execute javascript "window.history.back()"
              end tell
            end tell
          end tell
        `;
        executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: "Navigated back",
            },
          ],
        };
      }

      case "go_forward": {
        const script = `
          tell application "Arc"
            tell front window
              tell active tab
                execute javascript "window.history.forward()"
              end tell
            end tell
          end tell
        `;
        executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: "Navigated forward",
            },
          ],
        };
      }

      case "execute_javascript": {
        const { code, tab_id } = args as { code: string; tab_id?: number };
        const tabSelector = tab_id ? `tab ${tab_id}` : "active tab";
        const base64Code = Buffer.from(code).toString('base64');
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
        return {
          content: [
            {
              type: "text",
              text: result || "JavaScript executed (no return value)",
            },
          ],
        };
      }

      case "get_page_content": {
        const { tab_id } = args as { tab_id?: number };
        const tabSelector = tab_id ? `tab ${tab_id}` : "active tab";
        const script = `
          tell application "Arc"
            tell front window
              tell ${tabSelector}
                execute javascript "document.body.innerText"
              end tell
            end tell
          end tell
        `;
        const result = executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "click_element": {
        const { selector, tab_id } = args as { selector: string; tab_id?: number };
        const tabSelector = tab_id ? `tab ${tab_id}` : "active tab";
        const jsCode = `
          (function() {
            const element = document.querySelector('${selector.replace(/'/g, "\\'")}');
            if (!element) {
              return 'Error: Element not found with selector: ${selector.replace(/'/g, "\\'")}';
            }
            element.click();
            return 'Clicked element: ' + element.tagName + (element.id ? '#' + element.id : '') + (element.className ? '.' + element.className.split(' ').join('.') : '');
          })()
        `;
        const base64Js = Buffer.from(jsCode).toString('base64');
        const script = `
          tell application "Arc"
            tell front window
              tell ${tabSelector}
                execute javascript "eval(atob('${base64Js}'))"
              end tell
            end tell
          end tell
        `;
        const result = executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "get_dom_tree": {
        const { max_depth = 5, tab_id } = args as { max_depth?: number; tab_id?: number };
        const tabSelector = tab_id ? `tab ${tab_id}` : "active tab";
        const jsCode = `
          (function() {
            function isInteractive(el) {
              const tag = el.tagName.toLowerCase();
              const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'label'];
              const hasClick = el.onclick || el.getAttribute('onclick');
              const hasRole = ['button', 'link', 'tab', 'menuitem'].includes(el.getAttribute('role'));
              return interactiveTags.includes(tag) || hasClick || hasRole;
            }

            function getSelector(el) {
              if (el.id) return '#' + el.id;
              if (el.className && typeof el.className === 'string') {
                const classes = el.className.trim().split(/\\s+/).slice(0, 2).join('.');
                return el.tagName.toLowerCase() + (classes ? '.' + classes : '');
              }
              return el.tagName.toLowerCase();
            }

            function traverse(el, depth, maxDepth) {
              if (depth > maxDepth) return null;

              const children = [];
              for (let child of el.children) {
                const childNode = traverse(child, depth + 1, maxDepth);
                if (childNode) children.push(childNode);
              }

              const isInteractiveEl = isInteractive(el);
              if (!isInteractiveEl && children.length === 0 && depth > 0) {
                return null;
              }

              const node = {
                tag: el.tagName.toLowerCase(),
                selector: getSelector(el),
                text: el.textContent ? el.textContent.substring(0, 50).trim() : ''
              };

              if (isInteractiveEl) {
                node.interactive = true;
                if (el.tagName.toLowerCase() === 'a') node.href = el.href;
                if (el.tagName.toLowerCase() === 'button') node.type = el.type;
              }

              if (children.length > 0) {
                node.children = children;
              }

              return node;
            }

            return JSON.stringify(traverse(document.body, 0, ${max_depth}), null, 2);
          })()
        `;
        const base64Js = Buffer.from(jsCode).toString('base64');
        const script = `
          tell application "Arc"
            tell front window
              tell ${tabSelector}
                execute javascript "eval(atob('${base64Js}'))"
              end tell
            end tell
          end tell
        `;
        const result = executeAppleScript(script);
        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
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
