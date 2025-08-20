import { McpItem } from '../AiTypes.js';

import { OpenAI } from "openai";
import {
    FunctionTool,
    ResponseOutputItem,
    ResponseFunctionToolCall
} from "openai/src/resources/responses/responses.js";

import {
    McpTool,
    McpFunctionTool
} from '../McpTypes.js';
import {
    McpHost,
    McpServerModel,
    McpClientModel
} from '../McpHost.js';

/**
 * execute query OpenAI.
 * @param {McpItem} mcpPrompt	the query.
 * @param {McpHost} mcpHost	the mcp host.
 * @returns {result: string, results: Array<string>} the response.
 */
export async function executeQueryOpenAI(mcpPrompt: McpItem, mcpHost: McpHost): Promise<{ result: string, results: Array<string> }> {

    let result: string = "";
    let results: Array<string> = [];

    try {
		// open open ai
		const openai = new OpenAI({
			apiKey: "OPENAI-API-KEY"
		});

        // run the AI
        const response = await openai.responses.create({
            model: mcpPrompt.model,
            max_output_tokens: mcpPrompt.max_output_tokens,
            temperature: mcpPrompt.temperature,
            top_p: mcpPrompt.top_p,
            input: [
                {
                    role: "user",
                    content: mcpPrompt.query
                }],
            tools: getTools(mcpHost)
        });

        // if out
        if (response.output) {

            // for each tool
            for (var i = 0; i < response.output.length; i++) {

                // if the math tool was selected.
                var tool: ResponseOutputItem = response.output[i];
                if (tool.type === "function_call") {

                    // try and find the right tool.
                    results = await findTool(tool, mcpHost);
                }
            }
        }

        // return the result.
        result = results.length > 0 ? "success" : "info";

        // if no result, then just answer query.
        if (results.length <= 0) {

            // run the AI
            const responseInfo = await openai.responses.create({
                model: mcpPrompt.model,
                max_output_tokens: mcpPrompt.max_output_tokens,
                temperature: mcpPrompt.temperature,
                top_p: mcpPrompt.top_p,
                input: [
                    {
                        role: "user",
                        content: mcpPrompt.query
                    }]
            });

            // if out
            if (responseInfo && responseInfo.output_text) {
                // add the result.
                results.push(responseInfo.output_text);
            }
            else {
                results.push("error: no response");
            }
        }
	} catch (e) {
        result = `error: ${e}`;
    }

    // return the result.
    return { result, results };
}

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

/**
 * find the tool to execute the request.
 * @param {ResponseOutputItem} response     the output response.
 * @param {McpHost} mcpHost     the mcp host.
 * @returns {Array<string>} the list of results.
 */
async function findTool(response: ResponseOutputItem, mcpHost: McpHost): Promise<Array<string>> {

    // results
    let results: Array<string> = [];

    try {
        // get the host.
        let functionTool: ResponseFunctionToolCall = response as ResponseFunctionToolCall;
        let tool: McpFunctionTool = null;

        // try find tool
        tool = mcpHost.findFunctionTool(functionTool.name);
        if (tool) {
            try {
                let payload: any = undefined;

                // find the server.
                let serverModel: McpServerModel = mcpHost.findServer(tool.serverId);
                if (serverModel) {
                    // call the tool.
                    payload = await serverModel.server.callTool(functionTool.name, JSON.parse(functionTool.arguments));

                    // add the result.
                    results.push(payload.content[0].text);
                }

                // find the client.
                let clientModel: McpClientModel = mcpHost.findClient(tool.clientId);
                if (clientModel) {
                    // call the tool.
                    payload = await clientModel.client.callTool(functionTool.name, JSON.parse(functionTool.arguments));

                    // add the result.
                    results.push(payload.content[0].text);
                }
            } catch (ex) {
                results.push(`error: ${ex}`);
            }
        }
    } catch (ex) {
        results.push(`error: ${ex}`);
    }

    // return the results
    return results;
}
