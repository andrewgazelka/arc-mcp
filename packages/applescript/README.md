# @arc-mcp/applescript

Low-level AppleScript bridge for Arc browser automation.

## Installation

```bash
npm install @arc-mcp/applescript
```

## Usage

This package provides a single function for executing JavaScript in Arc browser tabs via AppleScript:

```typescript
import { executeArcJavaScript } from '@arc-mcp/applescript';

// Execute JavaScript in the active tab
const result = await executeArcJavaScript('document.title');

// Execute in a specific tab (by 1-based index)
const result = await executeArcJavaScript(
  'document.querySelector("h1").textContent',
  { tabId: '2' }
);

// With timeout
const result = await executeArcJavaScript('document.body.innerHTML', {
  timeout: 5000,
});
```

## API

### `executeArcJavaScript(code: string, options?: ExecuteOptions): Promise<any>`

Executes JavaScript code in an Arc browser tab.

**Parameters:**
- `code` - JavaScript code to execute
- `options` - Optional execution options
  - `tabId` - Tab index (1-based) as a string. If not provided, executes in active tab
  - `timeout` - Timeout in milliseconds (default: 30000)

**Returns:** Promise resolving to the result of the JavaScript execution

**Implementation Details:**
- Uses base64 encoding to avoid AppleScript escaping issues
- Automatically parses JSON results
- Falls back to string if result is not valid JSON

## Why Base64 Encoding?

AppleScript has complex string escaping rules. Base64 encoding the JavaScript code before passing it to AppleScript eliminates all escaping issues with quotes, newlines, and special characters.

```applescript
# JavaScript is encoded as base64
set encodedCode to "${base64Code}"
set decodedCode to do shell script "echo " & quoted form of encodedCode & " | base64 -d"
execute javascript decodedCode
```
