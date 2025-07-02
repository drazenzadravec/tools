import { McpClient } from './McpClient.js'
import { McpServerBase } from './McpServerBase.js'

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

    /**
     * Model context protocol host.
     */
    constructor() {

        // init
        this.mcpClients = [];
        this.mcpServers = [];
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
}