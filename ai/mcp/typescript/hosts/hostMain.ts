import {
	McpHost,
} from './McpHost.js';

import { MathJsMath } from "./servers/MathJsMath.js";
import { MicrosoftLearn } from "./clients/MicrosoftLearn.js";

/**
* create a new mcp host.
* @returns {McpHost} the host.
*/
export async function createMcpHost(): Promise<McpHost> {

	// create a new host.
	let mcpHost: McpHost = new McpHost();

	// load MathJs server
	let mathJsMath: MathJsMath = new MathJsMath();
	mathJsMath.register();
	mcpHost.addServerFunctionTools("mathJsMath", mathJsMath);

	// load Microsoft Learn client
	let microsoftLearn: MicrosoftLearn = new MicrosoftLearn();
	await microsoftLearn.openMicrosoftLearn();
	mcpHost.addClientFunctionTools("microsoftlearn", microsoftLearn);

	// return the mcp host.
	return mcpHost;
}
