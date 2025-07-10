import {
    Client
} from "@modelcontextprotocol/sdk/client/index.js";
import {
    StdioClientTransport
} from "@modelcontextprotocol/sdk/client/stdio.js";
import {
    StreamableHTTPClientTransport
} from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import {
    McpTool,
    McpPrompt,
    McpResource
} from './McpTypes.js'

/**
 * Model context protocol client.
 */
export class McpClient {

    // global.
    private open: boolean;
    private mcp: Client;
    private transport: StdioClientTransport | null = null;
    private httpTransport: StreamableHTTPClientTransport | null = null;
    private tools: Array<McpTool>;
    private prompts: Array<McpPrompt>;
    private resources: Array<McpResource>;

    /**
     * Model context protocol client.
     * @param {string} name     client name.
     * @param {string} version  client version.
     * @example
     *      name: "client-mcp",
            version: "1.0.0",
     * 
     */
    constructor(public name: string, public version: string) {

        // create the client.
        this.open = false;
        this.mcp = new Client({
            name: name,
            version: version
        });

        // init
        this.tools = [];
        this.prompts = [];
        this.resources = [];
    }

    /**
     * is connected to MCP server.
     * @returns {boolean} true if connected to server; else false.
     */
    isConnected(): boolean {
        return this.open;
    }

    /**
     * get the list of tools
     * @returns {McpTool[]} the list of tools; else empty.
     */
    getTools(): Array<McpTool> {
        return this.tools;
    }

    /**
     * get the list of prompts
     * @returns {McpPrompt[]} the list of prompts; else empty.
     */
    getPrompts(): Array<McpPrompt> {
        return this.prompts;
    }

    /**
     * get the list of resources
     * @returns {McpResource[]} the list of resources; else empty.
     */
    getResources(): Array<McpResource> {
        return this.resources;
    }

    /**
     * after initialization has completed, this will be populated with the server's reported capabilities.
     * @returns {object} the server capabilities; else empty.
     */
    getServerCapabilities(): any | null | undefined {
        // if open.
        if (this.open) {
            return this.mcp.getServerCapabilities();
        }
        else {
            return null;
        }
    }

    /**
     * call the tool.
     * @param {string} name     the name of the tool
     * @param {object} args     the arguments.
     * @returns {object} the result; else null.
     */
    async callTool(name: string, args: any): Promise<any | null> {
        // if open.
        if (this.open) {
            return await this.mcp.callTool({
                name: name,
                arguments: args
            });
        }
        else {
            return null;
        }
    }

    /**
     * get the prompt
     * @param {string} name     the name of the prompt
     * @param {object} args     the arguments.
     * @returns {object} the result; else null.
     */
    async callPrompt(name: string, args: any): Promise<any | null> {
        // if open.
        if (this.open) {
            return await this.mcp.getPrompt({
                name: name,
                arguments: args
            });
        }
        else {
            return null
        }
    }

    /**
     * read the resource.
     * @param {string} uri  the resource URI.
     * @returns {object} the result; else null.
     */
    async callResource(uri: string): Promise<any | null> {
        // if open.
        if (this.open) {
            return await this.mcp.readResource({
                uri: uri
            });
        }
        else {
            return null
        }
    }

    /**
     * disconnect from the MCP server.
     */
    async closeConnection(): Promise<void> {
        // if open.
        if (this.open) {
            // close the mcp connection.
            await this.mcp.close();
            this.open = false;

            // init
            this.tools = [];
            this.prompts = [];
            this.resources = [];
        }
    }

    /**
     * connect to the MCP server.
     * start receiving messages on stdin and sending messages on stdout.
     * @param {string} serverScriptPath the server script full path.
     */
    async openConnectionStdio(serverScriptPath: string): Promise<void> {

        // if not open.
        if (!this.open) {
            try {

                // only if JavaScript or Python
                const isJs = serverScriptPath.endsWith(".js");
                const isPy = serverScriptPath.endsWith(".py");

                // if not JavaScript and not Python
                if (!isJs && !isPy) {
                    throw new Error("Server script must be a .js or .py file");
                }

                // the command to execute
                const command = isPy
                    ? process.platform === "win32"
                        ? "python"
                        : "python3"
                    : process.execPath;

                // create the transport to the server
                // using the command and arguments
                this.transport = new StdioClientTransport({
                    command,
                    args: [serverScriptPath],
                });

                // open a connection to the MCP server.
                await this.mcp.connect(this.transport);
                let list_error: boolean = false;

                try {
                    // load all tools.
                    const toolsResult = await this.mcp.listTools();
                    if (toolsResult !== null) {
                        if (toolsResult.tools.length > 0) {
                            this.tools = toolsResult.tools.map((tool) => {
                                return {
                                    name: tool.name,
                                    title: tool.title,
                                    description: tool.description,
                                    inputSchema: tool.inputSchema,
                                };
                            });
                        }
                    }
                } catch (etools) {
                    list_error = true;
                }
                
                try {
                    // load all prompts.
                    const promptsResult = await this.mcp.listPrompts();
                    if (promptsResult !== null) {
                        if (promptsResult.prompts.length > 0) {
                            this.prompts = promptsResult.prompts.map((prompt) => {
                                return {
                                    name: prompt.name,
                                    title: prompt.title,
                                    description: prompt.description,
                                    arguments: prompt.arguments
                                };
                            });
                        }
                    }
                } catch (eprompts) {
                    list_error = true;
                }

                try {
                    // load all resources.
                    const resourcesResult = await this.mcp.listResources();
                    if (resourcesResult !== null) {
                        if (resourcesResult.resources.length > 0) {
                            this.resources = resourcesResult.resources.map((resource) => {
                                return {
                                    name: resource.name,
                                    title: resource.title,
                                    description: resource.description,
                                    uri: resource.uri,
                                    mimeType: resource.mimeType
                                };
                            });
                        }
                    }
                } catch (eresources) {
                    list_error = true;
                }

                // connection open.
                this.open = true;

            } catch (e) {
                this.open = false;
                throw e;
            }
        }
    }

    /**
     * connect to the MCP server.
     * start receiving messages on streamable HTTP.
     * For remote servers, set up a Streamable HTTP transport that handles 
     * both client requests and server-to-client notifications.
     * @param {string} serverUrl the server URL path.
     * @param {RequestInit} requestInit customizes HTTP requests to the server.
     * @example
     *      serverUrl: "https://example.com/mcp",
            requestInit: {
                headers: { 'Authorization': 'Bearer <secret>'
            }
     * 
     */
    async openConnectionHttp(serverUrl: string, requestInit?: RequestInit): Promise<void> {

        // if not open.
        if (!this.open) {
            try {
                const baseUrl = new URL(serverUrl);

                // create the transport to the server
                // using the command and arguments
                if (requestInit) {
                    this.httpTransport = new StreamableHTTPClientTransport(
                        new URL(baseUrl),
                        {
                            requestInit: requestInit
                        }
                    );
                }
                else {
                    this.httpTransport = new StreamableHTTPClientTransport(
                        new URL(baseUrl));
                }

                // open a connection to the MCP server.
                await this.mcp.connect(this.httpTransport);
                let list_error: boolean = false;

                try {
                    // load all tools.
                    const toolsResult = await this.mcp.listTools();
                    if (toolsResult !== null) {
                        if (toolsResult.tools.length > 0) {
                            this.tools = toolsResult.tools.map((tool) => {
                                return {
                                    name: tool.name,
                                    title: tool.title,
                                    description: tool.description,
                                    inputSchema: tool.inputSchema,
                                };
                            });
                        }
                    }
                } catch (etools) {
                    list_error = true;
                }

                try {
                    // load all prompts.
                    const promptsResult = await this.mcp.listPrompts();
                    if (promptsResult !== null) {
                        if (promptsResult.prompts.length > 0) {
                            this.prompts = promptsResult.prompts.map((prompt) => {
                                return {
                                    name: prompt.name,
                                    title: prompt.title,
                                    description: prompt.description,
                                    arguments: prompt.arguments
                                };
                            });
                        }
                    }
                } catch (eprompts) {
                    list_error = true;
                }

                try {
                    // load all resources.
                    const resourcesResult = await this.mcp.listResources();
                    if (resourcesResult !== null) {
                        if (resourcesResult.resources.length > 0) {
                            this.resources = resourcesResult.resources.map((resource) => {
                                return {
                                    name: resource.name,
                                    title: resource.title,
                                    description: resource.description,
                                    uri: resource.uri,
                                    mimeType: resource.mimeType
                                };
                            });
                        }
                    }
                } catch (eresources) {
                    list_error = true;
                }

                // connection open.
                this.open = true;

            } catch (e) {
                this.open = false;
                throw e;
            }
        }
    }
}