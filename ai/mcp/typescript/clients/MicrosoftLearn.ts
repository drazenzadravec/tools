import { McpClient } from '../McpClient.js';
import {
    McpTool,
    McpPrompt,
    McpResource
} from '../McpTypes.js'

/**
 * Microsoft learn.
 * // https://github.com/microsoftdocs/mcp
 */
export class MicrosoftLearn extends McpClient {

    /**
     * Microsoft learn.
     */
    constructor() {
        super("MicrosoftDocsSearch", "1.8.9");
    }

    /**
     * open microsoft learn connection.
     * @returns {boolean} true if opened; else false.
     */
    async openMicrosoftLearn(): Promise<void> {

        try {
            // open a new connection.
            await this.openConnectionHttp("https://learn.microsoft.com/api/mcp");

            // change the required parameter
            let tools: McpTool[] = this.getTools();
            for (var i = 0; i < tools.length; i++) {
                if (!tools[i].parameters.required) {
                    // change
                    tools[i].parameters.required = ['query'];
                }
            }

        } catch (e) {
            let error: any = e;
        }
    }
}


//var client = new MicrosoftLearn();
//await client.openMicrosoftLearn();
//var tools = client.getTools();
//console.log(tools[2].parameters);
