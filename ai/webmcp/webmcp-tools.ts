// WebMCP Tools
export const mathController = new AbortController();

/**
 * Lists all registered tools.   
 * @returns {WebMCP.RegisteredTool[]} A promise that resolves to an array of registered tools.
 */
export async function listTools(): Promise<WebMCP.RegisteredTool[]> {

    // get the list of registered tools from the model context.
    let tools: WebMCP.RegisteredTool[] = await document.modelContext.getTools();
    return tools;
}

/**
 * gets a registered tool by name.
 * @param {string} name the name of the tool to get.
 * @returns {WebMCP.RegisteredTool} A promise that resolves to an array of registered tools.
 */
export async function getTool(name: string): Promise<WebMCP.RegisteredTool | null> {

    // get the list of registered tools from the model context.
    let tools: WebMCP.RegisteredTool[] = await document.modelContext.getTools();

    // if there are registered tools, try to find the math tool and execute it.
    if (tools.length > 0) {
        // try to find the math tool in the list of registered tools.
        let tool: WebMCP.RegisteredTool = tools.find((t) => t.name === name);
        return tool;
    }
    else {
        return null;
    }
}

/**
 register the math tool with the model context.
 */
export async function registerTool_Math(): Promise<void> {

    // register the math tool with the model context.
    await document.modelContext.registerTool(
        {
            name: "MathExpressionEvaluator",
            description: "Use SymPy to execute the mathematical expressions.",
            inputSchema: {
                type: "object",
                properties: {
                    expression: {
                        type: "string", description: "the SymPy mathematical expression."
                    }
                },
                required: [
                    "expression"
                ],
                additionalProperties: false
            },
            execute: async ({ expression }, { signal }) => {

                try {
                    // make a POST request to the math expression evaluator API endpoint.
                    let response: Response = await fetch("/awsapi/api/math/exp", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            functionindex: "20",
                            expression: expression
                        }),
                        signal: signal
                    });

                    // if not 200, throw an error
                    if (response.status !== 200) {
                        return { "result": "Access Denied." };
                    }
                    else {
                        let result = await response.json();
                        return { "result": result };
                    }
                } catch (err) {
                    // Roll back the UI state this execution set, so a cancelled run leaves no trace.
                    
                    if (signal.aborted) {
                        // The execution was cancelled: re-throw instead of returning an error value.
                        throw err;
                    }

                    // Return other errors as a value instead of throwing, so the agent receives the message.
                    return { "result": err instanceof Error ? err.message : String(err) };
                }
            },
            annotations: {
                readOnlyHint: true
            }
        },
        {
            signal: mathController.signal,
            exposedTo: [
                "https://dznequeo.net/",
                "https://www.dznequeo.net/"
            ]
        }
    );
}

/**
 * execute the math tool with the given expression and function index.
 * @param {string} expression the mathematical expression to evaluate.
 * @returns {string} A promise that resolves to an string.
 */
export async function executeTool_Math(expression: string): Promise<string> {

    let result: string = "";
    let tools: WebMCP.RegisteredTool[] = await listTools();

    // if there are registered tools, try to find the math tool and execute it.
    if (tools.length > 0) {

        // try to find the math tool in the list of registered tools.
        let tool: WebMCP.RegisteredTool = tools.find((t) => t.name === "MathExpressionEvaluator");

        // if the math tool is not found, throw an error.
        let inputObject = { expression: expression };
        let options = { signal: mathController.signal };

        try {
            // execute the math tool with the given expression and function index.
            result = await document.modelContext.executeTool(tool, inputObject, options);

        } catch (err) {

            // If the error is due to a parsing issue, try executing the tool again with the input as a JSON string.
            if (err?.message?.startsWith("Failed to parse input")) {
                result = await document.modelContext.executeTool(
                    tool,
                    JSON.stringify(inputObject) as any,
                    options
                );
            } else {
                // Re-throw real tool execution or cancellation errors:
                throw err;
            }
        }
    }

    // Return the result of the tool execution.
    return result;
}
