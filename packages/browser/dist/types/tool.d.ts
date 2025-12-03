/**
 * MCP tool result format
 */
export type ToolResult = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
};
//# sourceMappingURL=tool.d.ts.map