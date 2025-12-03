/**
 * Arc MCP Server - Playwright-style semantic browser automation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ensureArcRunning } from './applescript.js';
import {
  handleClick,
  handleFill,
  handleType,
  handleSelect,
  handleGetPageStructure,
} from './tools/semantic.js';
import {
  handleOpenUrl,
  handleGetCurrentTab,
  handleListTabs,
  handleCloseTab,
  handleSwitchToTab,
  handleReloadTab,
  handleGoBack,
  handleGoForward,
  handleExecuteJavaScript,
} from './tools/navigation.js';
import type { LocatorStrategy } from '../types/locator.js';
import type { ActionOptions } from '../types/action.js';

const server = new Server(
  {
    name: 'arc-mcp',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'click',
        description: 'Click an element using semantic locators (role, label, text, placeholder, or CSS)',
        inputSchema: {
          type: 'object',
          properties: {
            role: {
              type: 'object',
              description: 'Find by ARIA role',
              properties: {
                role: {
                  type: 'string',
                  description: 'ARIA role (button, link, textbox, combobox, etc.)',
                },
                name: {
                  type: 'string',
                  description: 'Accessible name (optional)',
                },
              },
              required: ['role'],
            },
            label: {
              type: 'string',
              description: 'Find input by associated label text',
            },
            text: {
              type: 'string',
              description: 'Find element containing this text',
            },
            placeholder: {
              type: 'string',
              description: 'Find input by placeholder attribute',
            },
            css: {
              type: 'string',
              description: 'CSS selector (fallback)',
            },
            tab_id: {
              type: 'number',
              description: 'Target tab ID (optional)',
            },
          },
          oneOf: [
            { required: ['role'] },
            { required: ['label'] },
            { required: ['text'] },
            { required: ['placeholder'] },
            { required: ['css'] },
          ],
        },
      },
      {
        name: 'fill',
        description: 'Fill an input field with a value (fast, replaces entire value)',
        inputSchema: {
          type: 'object',
          properties: {
            role: {
              type: 'object',
              description: 'Find by ARIA role',
              properties: {
                role: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['role'],
            },
            label: { type: 'string' },
            text: { type: 'string' },
            placeholder: { type: 'string' },
            css: { type: 'string' },
            value: {
              type: 'string',
              description: 'Value to fill into the input',
            },
            tab_id: { type: 'number' },
          },
          required: ['value'],
          oneOf: [
            { required: ['role', 'value'] },
            { required: ['label', 'value'] },
            { required: ['text', 'value'] },
            { required: ['placeholder', 'value'] },
            { required: ['css', 'value'] },
          ],
        },
      },
      {
        name: 'type',
        description: 'Type text character-by-character (triggers autocomplete)',
        inputSchema: {
          type: 'object',
          properties: {
            role: {
              type: 'object',
              properties: {
                role: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['role'],
            },
            label: { type: 'string' },
            text: { type: 'string' },
            placeholder: { type: 'string' },
            css: { type: 'string' },
            text_to_type: {
              type: 'string',
              description: 'Text to type character-by-character',
            },
            tab_id: { type: 'number' },
          },
          required: ['text_to_type'],
          oneOf: [
            { required: ['role', 'text_to_type'] },
            { required: ['label', 'text_to_type'] },
            { required: ['text', 'text_to_type'] },
            { required: ['placeholder', 'text_to_type'] },
            { required: ['css', 'text_to_type'] },
          ],
        },
      },
      {
        name: 'select_option',
        description: 'Select an option from a dropdown',
        inputSchema: {
          type: 'object',
          properties: {
            role: {
              type: 'object',
              properties: {
                role: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['role'],
            },
            label: { type: 'string' },
            text: { type: 'string' },
            placeholder: { type: 'string' },
            css: { type: 'string' },
            option: {
              type: 'string',
              description: 'Option text or value to select',
            },
            tab_id: { type: 'number' },
          },
          required: ['option'],
          oneOf: [
            { required: ['role', 'option'] },
            { required: ['label', 'option'] },
            { required: ['text', 'option'] },
            { required: ['placeholder', 'option'] },
            { required: ['css', 'option'] },
          ],
        },
      },
      {
        name: 'get_page_structure',
        description: 'Get a structured tree representation of the page with interactive elements',
        inputSchema: {
          type: 'object',
          properties: {
            max_depth: {
              type: 'number',
              description: 'Maximum depth to traverse (default: 10)',
              default: 10,
            },
            tab_id: {
              type: 'number',
              description: 'Target tab ID (optional)',
            },
          },
        },
      },
      {
        name: 'open_url',
        description: 'Open a URL in Arc browser',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to open',
            },
            new_tab: {
              type: 'boolean',
              description: 'Open in a new tab (default: true)',
              default: true,
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'get_current_tab',
        description: 'Get information about the current active tab',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_tabs',
        description: 'List all open tabs in Arc',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'close_tab',
        description: 'Close a specific tab',
        inputSchema: {
          type: 'object',
          properties: {
            tab_id: {
              type: 'number',
              description: 'ID of the tab to close',
            },
          },
          required: ['tab_id'],
        },
      },
      {
        name: 'switch_to_tab',
        description: 'Switch to a specific tab',
        inputSchema: {
          type: 'object',
          properties: {
            tab_id: {
              type: 'number',
              description: 'ID of the tab to switch to',
            },
          },
          required: ['tab_id'],
        },
      },
      {
        name: 'reload_tab',
        description: 'Reload a tab',
        inputSchema: {
          type: 'object',
          properties: {
            tab_id: {
              type: 'number',
              description: 'ID of the tab to reload (optional, defaults to current)',
            },
          },
        },
      },
      {
        name: 'go_back',
        description: 'Navigate back in browser history',
        inputSchema: {
          type: 'object',
          properties: {
            tab_id: {
              type: 'number',
              description: 'ID of the tab (optional, defaults to current)',
            },
          },
        },
      },
      {
        name: 'go_forward',
        description: 'Navigate forward in browser history',
        inputSchema: {
          type: 'object',
          properties: {
            tab_id: {
              type: 'number',
              description: 'ID of the tab (optional, defaults to current)',
            },
          },
        },
      },
      {
        name: 'execute_javascript',
        description: 'Execute arbitrary JavaScript in a tab',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'JavaScript code to execute',
            },
            tab_id: {
              type: 'number',
              description: 'ID of the tab (optional, defaults to current)',
            },
          },
          required: ['code'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const safeArgs = (args ?? {}) as Record<string, unknown>;

  try {
    ensureArcRunning();

    switch (name) {
      case 'click': {
        const locator = extractLocator(safeArgs);
        const options = extractOptions(safeArgs);
        return handleClick(locator, options);
      }

      case 'fill': {
        const locator = extractLocator(safeArgs);
        const { value } = safeArgs as { value: string };
        const options = extractOptions(safeArgs);
        return handleFill(locator, value, options);
      }

      case 'type': {
        const locator = extractLocator(safeArgs);
        const { text_to_type } = safeArgs as { text_to_type: string };
        const options = extractOptions(safeArgs);
        return handleType(locator, text_to_type, options);
      }

      case 'select_option': {
        const locator = extractLocator(safeArgs);
        const { option } = safeArgs as { option: string };
        const options = extractOptions(safeArgs);
        return handleSelect(locator, option, options);
      }

      case 'get_page_structure': {
        const { max_depth = 10, tab_id } = safeArgs as {
          max_depth?: number;
          tab_id?: number;
        };
        return handleGetPageStructure(max_depth, tab_id);
      }

      case 'open_url': {
        const { url, new_tab = true } = safeArgs as {
          url: string;
          new_tab?: boolean;
        };
        return handleOpenUrl(url, new_tab);
      }

      case 'get_current_tab':
        return handleGetCurrentTab();

      case 'list_tabs':
        return handleListTabs();

      case 'close_tab': {
        const { tab_id } = safeArgs as { tab_id: number };
        return handleCloseTab(tab_id);
      }

      case 'switch_to_tab': {
        const { tab_id } = safeArgs as { tab_id: number };
        return handleSwitchToTab(tab_id);
      }

      case 'reload_tab': {
        const { tab_id } = safeArgs as { tab_id?: number };
        return handleReloadTab(tab_id);
      }

      case 'go_back': {
        const { tab_id } = safeArgs as { tab_id?: number };
        return handleGoBack(tab_id);
      }

      case 'go_forward': {
        const { tab_id } = safeArgs as { tab_id?: number };
        return handleGoForward(tab_id);
      }

      case 'execute_javascript': {
        const { code, tab_id } = safeArgs as { code: string; tab_id?: number };
        return handleExecuteJavaScript(code, tab_id);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: unknown) {
    const err = error as Error;
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${err.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Extract locator strategy from args
 */
function extractLocator(args: Record<string, unknown>): LocatorStrategy {
  if ('role' in args && args['role']) {
    return { role: args['role'] as { role: string; name?: string } };
  }
  if ('label' in args && args['label']) {
    return { label: args['label'] as string };
  }
  if ('text' in args && args['text']) {
    return { text: args['text'] as string };
  }
  if ('placeholder' in args && args['placeholder']) {
    return { placeholder: args['placeholder'] as string };
  }
  if ('css' in args && args['css']) {
    return { css: args['css'] as string };
  }
  throw new Error('No valid locator strategy provided');
}

/**
 * Extract action options from args
 */
function extractOptions(args: Record<string, unknown>): ActionOptions {
  return {
    tab_id: ('tab_id' in args ? args['tab_id'] : undefined) as number | undefined,
    timeout: ('timeout' in args ? args['timeout'] : undefined) as number | undefined,
  };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
