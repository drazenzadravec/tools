import { McpClient } from './McpClient.js'
import { McpServerBase } from './McpServerBase.js'
import { McpTool } from './McpTypes.js'

/**
 * mcp client model.
 */
export interface McpClientModel {
    id: string;
    client: McpClient;
}

/**
 * mcp server model.
 */
export interface McpServerModel {
    id: string;
    server: McpServerBase;
}

/**
 * mcp function tool
 */
export interface McpFunctionTool {
    clientId: string;
    serverId: string;
    type: string;
    name: string;
    description?: string | null;
    strict: boolean;
    parameters: Record<string, unknown>;
}

/**
 * Model context protocol host.
 */
export class McpHost {

    // global.
    private mcpClients: Array<McpClientModel>;
    private mcpServers: Array<McpServerModel>;
    private mcpFunctionTools: Array<McpFunctionTool>;

    /**
     * Model context protocol host.
     */
    constructor() {

        // init
        this.mcpClients = [];
        this.mcpServers = [];
        this.mcpFunctionTools = [];
    }

    /**
     * get the list of clients
     * @returns {Array<McpClientModel>} list of clients
     */
    getClients(): Array<McpClientModel> {
        return this.mcpClients;
    }

    /**
     * get the list of servers
     * @returns {Array<McpServerModel>} list of servers
     */
    getServers(): Array<McpServerModel> {
        return this.mcpServers;
    }

    /**
     * get the list of function tools
     * @returns {Array<McpFunctionTool>} list of function tools
     */
    getFunctionTools(): Array<McpFunctionTool> {
        return this.mcpFunctionTools;
    }

    /**
     * add an MCP client.
     * @param {string} id   the unique id.
     * @param {McpClient} client    the mcp client.
     */
    addClient(id: string, client: McpClient): void {
        // add a new client.
        this.mcpClients.push({
            id: id,
            client: client
        });
    }

    /**
     * add an MCP server.
     * @param {string} id   the unique id.
     * @param {McpServerBase} server    the mcp server.
     */
    addServer(id: string, server: McpServerBase): void {
        // add a new server.
        this.mcpServers.push({
            id: id,
            server: server
        });
    }

    /**
     * add an MCP function tool.
     * @param {McpTool} tool    the mcp tool.
     * @param {string} clientId    the mcp client Id.
     * @param {string} serverId    the mcp server Id.
     */
    addFunctionTool(tool: McpTool, clientId: string, serverId: string): void {
        // add a new function tool.
        this.mcpFunctionTools.push({
            clientId: clientId,
            serverId: serverId,
            type: "function",
            name: tool.name,
            description: tool.description,
            strict: true,
            parameters: tool.inputSchema
        });
    }

    /**
     * find an MCP client.
     * @param {string} id   the unique id.
     * @returns {McpClientModel} the mcp client
     */
    findClient(id: string): McpClientModel | null {
        return this.mcpClients.find(function (item) {
            return (item.id === id || item.id === id);
        })
    }

    /**
     * find an MCP server.
     * @param {string} id   the unique id.
     * @returns {McpServerModel} the mcp server
     */
    findServer(id: string): McpServerModel | null {
        return this.mcpServers.find(function (item) {
            return (item.id === id || item.id === id);
        })
    }

    /**
     * find an MCP function tool.
     * @param {string} name   the unique name.
     * @returns {McpFunctionTool} the mcp function tool
     */
    findFunctionTool(name: string): McpFunctionTool | null {
        return this.mcpFunctionTools.find(function (item) {
            return (item.name === name || item.name === name);
        })
    }
}