/**
 * Arc MCP Server - Node.js REPL for browser automation
 *
 * This server exposes a single REPL tool that runs Node.js code
 * with @arc-mcp/browser functions available in scope.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AsyncFunction } from './repl.js';
import * as browser from '@arc-mcp/browser';

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
        name: 'execute',
        description:
          'Execute Node.js code with Arc browser automation functions available. ' +
          'Available functions: browser.click(locator, options?), browser.fill(locator, value, options?), ' +
          'browser.type(locator, text, options?), browser.selectOption(locator, option, options?), ' +
          'browser.getPageStructure(maxDepth?, tabId?), browser.openUrl(url, newTab?), ' +
          'browser.getCurrentTab(), browser.listTabs(), browser.closeTab(tabId), ' +
          'browser.switchToTab(tabId), browser.reloadTab(tabId?), browser.goBack(tabId?), ' +
          'browser.goForward(tabId?), browser.executeJavaScript(code, tabId?). ' +
          'Locator types: { role: { role: string, name?: string } } | { label: string } | ' +
          '{ text: string } | { placeholder: string } | { css: string }',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Node.js code to execute (async/await supported)',
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
    if (name !== 'execute') {
      throw new Error(`Unknown tool: ${name}`);
    }

    browser.ensureArcRunning();

    const { code } = safeArgs as { code: string };

    // Create async function with browser in scope
    const fn = AsyncFunction('browser', code);
    const result = await fn(browser);

    // Format result
    const output =
      result === undefined
        ? 'undefined'
        : typeof result === 'string'
        ? result
        : JSON.stringify(result, null, 2);

    return {
      content: [{ type: 'text', text: output }],
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${err.message}\n${err.stack || ''}`,
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
  console.error('Server error:', error);
  process.exit(1);
});
