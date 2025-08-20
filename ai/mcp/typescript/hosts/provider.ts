import { executeQueryOpenAI } from './openai.js';
import { McpItem } from './AiTypes.js';

import {
    McpHost,
} from '../McpHost.js';

/**
 * execute provider.
 * @param {McpItem} mcpPrompt	the prompt.
 * @param {McpHost} mcpHost	the mcp host.
 * @returns {result: string, results: Array<string>} the response.
 */
export async function executeProvider(mcpPrompt: McpItem, mcpHost: McpHost): Promise<{ result: string, results: Array<string> }> {
    let res: any;

    // select provider.
    if (mcpPrompt.provider.toLowerCase() === "openai") {
        // open ai
        res = await executeQueryOpenAI(mcpPrompt, mcpHost);
    }
    else {
        res = { result: "error: provider not supported", results: [ "error: no result" ]};
    }

    // return
    return res;
}
