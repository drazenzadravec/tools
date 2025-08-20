## MCP Hosts

### OpenAI
OpenAI Host implementation

```typescript
/**
* get the tools.
* @param {McpHost} mcpHost     the mcp host.
* @returns {FunctionTool[]}    the list of tools
*/
function getTools(mcpHost: McpHost): Array<FunctionTool> {
    // the tools
    let tools: Array<FunctionTool> = [];

    // get the host.
    let functionTools: McpFunctionTool[] = mcpHost.getFunctionTools();
    for (var i = 0; i < functionTools.length; i++) {
        // add to tools
        let tool: McpTool = functionTools[i];
        tools.push({
            type: "function",
            name: tool.name,
            description: tool.description,
            parameters: {
                type: 'object',
                properties: tool.parameters.properties,
                required: tool.parameters.required,
                additionalProperties: false
            },
            strict: true
        })
    }

    // return the tools
    return tools;
}
```
