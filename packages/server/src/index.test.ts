import { test, expect, describe } from 'vitest';

describe('MCP Server error handling', () => {
  test('should identify ActionResult with success:false', () => {
    // Test the logic that checks for failed ActionResult
    const failedResult = {
      success: false,
      error: 'Element not found: {"role":{"role":"link","name":"Explore"}}',
    };

    // This is the check used in index.ts line 77
    const shouldBeError =
      failedResult &&
      typeof failedResult === 'object' &&
      'success' in failedResult &&
      failedResult.success === false;

    expect(shouldBeError).toBe(true);
    expect(failedResult.error).toContain('Element not found');
  });

  test('should not identify successful ActionResult as error', () => {
    const successResult = {
      success: true,
      element: '<button>Click me</button>',
    };

    const shouldBeError =
      successResult &&
      typeof successResult === 'object' &&
      'success' in successResult &&
      successResult.success === false;

    expect(shouldBeError).toBe(false);
  });

  test('should not identify undefined as error', () => {
    const result = undefined;

    const shouldBeError =
      result &&
      typeof result === 'object' &&
      'success' in result &&
      result.success === false;

    // When result is undefined, the check returns undefined (which is falsy)
    expect(shouldBeError).toBeFalsy();
  });

  test('should not identify non-ActionResult objects as error', () => {
    const result = { foo: 'bar', baz: 123 };

    const shouldBeError =
      result &&
      typeof result === 'object' &&
      'success' in result &&
      result.success === false;

    expect(shouldBeError).toBe(false);
  });

  test('should not identify objects with success:true as error', () => {
    const result = { success: true, data: 'something' };

    const shouldBeError =
      result &&
      typeof result === 'object' &&
      'success' in result &&
      result.success === false;

    expect(shouldBeError).toBe(false);
  });
});
