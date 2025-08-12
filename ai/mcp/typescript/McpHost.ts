import { McpClient } from './McpClient.js'
import { McpServerBase } from './McpServerBase.js'
import { McpTool, McpFunctionTool } from './McpTypes.js'

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
 * Model context protocol host.
 */
export class McpHost {

    // global.
    private mcpClients: Array<McpClientModel>;
    private mcpServers: Array<McpServerModel>;
    private mcpFunctionTools: Array<McpFunctionTool>;

    // event logging function.
    private logEvent: (eventType: string, name: string, message: string, details: any) => void;

    /**
     * Model context protocol host.
     */
    constructor() {

        // init
        this.mcpClients = [];
        this.mcpServers = [];
        this.mcpFunctionTools = [];
        this.logEvent = null;
    }

    /**
     * Subscribe to the on event.
     *
     * @param {function}	event callback(eventType, name, message, details).
     */
    onEvent(event: (eventType: string, name: string, message: string, details: any) => void): void {
        // assign the event.
        this.logEvent = event;
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
            inputSchema: tool.inputSchema,
            parameters: tool.parameters
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

    /**
    * close all clients and servers.
    */
    async closeAll(): Promise<void> {
        await this.closeServers();
        await this.closeClients();

        this.mcpClients = [];
        this.mcpServers = [];
        this.mcpFunctionTools = [];

        this.logEvent = null;
    }

    /**
    * close all servers.
    */
    async closeServers(): Promise<void> {

        // for each mcp server.
        for (var i = 0; i < this.mcpServers.length; i++) {
            try {
                // close.
                await this.mcpServers[i].server.stopServer();
            } catch (e) {
                if (this.logEvent) this.logEvent("error", "close", "close server", e);
            }
        }
    }

    /**
    * close all clients.
    */
    async closeClients(): Promise<void> {

        // for each mcp client.
        for (var i = 0; i < this.mcpClients.length; i++) {
            try {
                // close.
                await this.mcpClients[i].client.closeConnection();
            } catch (e) {
                if (this.logEvent) this.logEvent("error", "close", "close client", e);
            }
        }
    }

    /**
     * add the server function tools.
     * @param {string} id     the unique id.
     * @param {McpServerBase} mcpServer the mcp server
     */
    addServerFunctionTools(id: string, mcpServer: McpServerBase): void {

        // add each server.
        this.addServer(id, mcpServer);

        // add tools.
        let tools: McpTool[] = mcpServer.getTools();

        // assign function
        for (var i = 0; i < tools.length; i++) {
            // add to tools
            let tool: McpTool = tools[i];
            this.addFunctionTool(tool, "", id);
        }
    }

    /**
    * add the client function tools.
    * @param {string} id     the unique id.
    * @param {McpClient} mcpClient the mcp client
    */
    addClientFunctionTools(id: string, mcpClient: McpClient): void {

        // add each client.
        this.addClient(id, mcpClient);

        // add tools.
        let tools: McpTool[] = mcpClient.getTools();

        // assign function
        for (var i = 0; i < tools.length; i++) {
            // add to tools
            let tool: McpTool = tools[i];
            this.addFunctionTool(tool, id, "");
        }
    }
}