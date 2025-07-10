import {
    McpServer,
    RegisteredTool,
    RegisteredPrompt,
    RegisteredResource,
    RegisteredResourceTemplate,
    ToolCallback,
    PromptCallback,
    ReadResourceCallback,
    ReadResourceTemplateCallback,
    ResourceTemplate
} from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    StdioServerTransport
} from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    StreamableHTTPServerTransport
} from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { randomUUID } from "node:crypto";
import {
    z,
    ZodRawShape,
} from 'zod';

/**
 * Model context protocol tool.
 */
export interface McpTool {
    "name"?: string;
    "title"?: string;
    "description"?: string;
    "inputSchema"?: any;
}

/**
 * Model context protocol tool callback.
 */
export interface McpToolCallback {
    "name"?: string;
    "callback"?: ToolCallback<undefined | ZodRawShape>;
}

/**
 * Model context protocol prompt.
 */
export interface McpPrompt {
    "name"?: string;
    "title"?: string;
    "description"?: string;
    "arguments"?: any;
}

/**
 * Model context protocol prompt callback.
 */
export interface McpPromptCallback {
    "name"?: string;
    "callback"?: PromptCallback<undefined | any /*PromptArgsRawShape*/>;
}

/**
 * Model context protocol prompt helper.
 */
export interface McpPromptHelper {
    "name"?: string;
    "prompt"?: string;
}

/**
 * Model context protocol resource.
 */
export interface McpResource {
    "name"?: string;
    "title"?: string;
    "description"?: string;
    "uri"?: string | ResourceTemplate;
    "mimeType"?: string;
}

/**
 * Model context protocol resource callback.
 */
export interface McpResourceCallback {
    "name"?: string;
    "callback"?: ReadResourceCallback | ReadResourceTemplateCallback;
}

/**
 * mcp http transport model.
 */
export interface McpHttpTransportModel {
    sessionId: string;
    transport: StreamableHTTPServerTransport;
}

/**
 * Model context protocol server base.
 */
export class McpServerBase {

    // global.
    private open: boolean;
    private mcp: McpServer;
    private httpTransportStateless: boolean;
    private httpTransports: Array<McpHttpTransportModel>;
    private tools: Array<McpTool>;
    private prompts: Array<McpPrompt>;
    private resources: Array<McpResource>;
    private toolsCallback: Array<McpToolCallback>;
    private promptsCallback: Array<McpPromptCallback>;
    private resourcesCallback: Array<McpResourceCallback>;

    /**
     * Model context protocol server base.
     * @param {string} name     server name.
     * @param {string} version  server version.
     * @param {string} instructions  server instructions.
     * @param {object} capabilities  server capabilities.
     * @example
     *      name: "weather",
            version: "1.0.0",
            instructions: "Use this server for....",
            capabilities: {
                resources: {},
                tools: {},
                prompts: {}
            }
     * 
     */
    constructor(public name: string, public version: string, instructions: string,
        public capabilities: {
            resources: {},
            tools: {},
            prompts: {}
        }
    ) {
        // create the server.
        this.open = false;
        this.httpTransportStateless = true;
        this.httpTransports = [];
        this.mcp = new McpServer(
            {
                name: name,
                version: version
            },
            {
                instructions: instructions,
                capabilities: capabilities
            });

        // init
        this.tools = [];
        this.prompts = [];
        this.resources = [];
        this.toolsCallback = [];
        this.promptsCallback = [];
        this.resourcesCallback = [];
    }

    /**
     * set http transport stateless value: defualt is true (no state).
     * @param {boolean} stateless  set the http transport stateless value; true if stateless; else has state.
     */
    setHttpTransportStateless(stateless: boolean): void {
        this.httpTransportStateless = stateless;
    }

    /**
     * has to MCP server started.
     * @returns {boolean} true if started; else false.
     */
    hasStarted(): boolean {
        return this.open;
    }

    /**
     * get the MCP server, used to register Tools, Resource, Prompts.
     * @returns {McpServer} the MCP server
     */
    getMcpServer(): McpServer {
        return this.mcp;
    }

    /**
     * get the list of mcp http transports.
     * @returns {McpHttpTransportModel} the mcp http transports
     */
    getHttpTransports(): Array<McpHttpTransportModel> {
        return this.httpTransports;
    }

    /**
     * find an MCP Http transport model.
     * @param {string} sessionId   the unique sessionId.
     * @returns {McpHttpTransportModel} the mcp http transport model
     */
    findHttpTransport(sessionId: string): McpHttpTransportModel | null {
        return this.httpTransports.find(function (item) {
            return (item.sessionId === sessionId || item.sessionId === sessionId);
        })
    }

    /**
     * registers a tool with a config object and callback.
     * @param {string} name         the name of the tool
     * @param {object} config       the tool configuration   
     * @param {Function} callback   the callback function.
     * @returns {boolean} true if register; else false.
     * @example 
     *  Add an addition tool:
     *  "add",
        {
            title: "Addition Tool",
            description: "Add two numbers",
            inputSchema: { a: z.number(), b: z.number() }
        },
        async ({ a, b }) => ({
            content: [{ type: "text", text: String(a + b) }]
        })
     */
    registerTool(
        name: string,
        config: {
            title?: string;
            description?: string;
            inputSchema?: any;
            outputSchema?: any;
            annotations?: any;
        },
        callback: any
    ): boolean {
        let result: boolean = false;
        try {
            let registeredTool: RegisteredTool = this.mcp.registerTool(
                name,
                {
                    title: config.title,
                    description: config.description,
                    inputSchema: config.inputSchema,
                    outputSchema: config.outputSchema,
                    annotations: config.annotations
                },
                callback
            );

            // add the tool
            this.tools.push({
                name: name,
                title: config.title,
                description: config.description,
                inputSchema: config.inputSchema
            });
            this.toolsCallback.push({
                name: name,
                callback: registeredTool.callback
            });
            result = true;
        } catch (e) {
            throw e;
        }
        return result;
    }

    /**
     * registers a resource with a config object and callback.
     * @param {string} name         the name of the resource
     * @param {string} uriOrTemplate    the URI or Template.
     * @param {object} config   the resource configuration 
     * @param {Function} callback   the callback function.
     * @returns {boolean} true if register; else false.
     * @example 
     *  Application Config:
     *  "config",
     *  "config://app",
        {
            title: "Application Config",
            description: "Application configuration data",
            mimeType: "text/plain"
        },
        async (uri) => ({
            contents: [{
                uri: uri.href,
                text: "App configuration here"
            }]
        })
     */
    registerResource(
        name: string,
        uriOrTemplate: string,
        config: {
            title?: string;
            description?: string;
            mimeType?: string;
        },
        callback: any
    ): boolean {
        let result: boolean = false;
        try {
            let registeredResource: RegisteredResource | RegisteredResourceTemplate = this.mcp.registerResource(
                name,
                uriOrTemplate,
                {
                    title: config.title,
                    description: config.description,
                    mimeType: config.mimeType
                },
                callback
            );

            // add the resource
            this.resources.push({
                name: name,
                title: config.title,
                description: config.description,
                uri: uriOrTemplate,
                mimeType: config.mimeType
            });
            this.resourcesCallback.push({
                name: name,
                callback: registeredResource.readCallback
            });
            result = true;
        } catch (e) {
            throw e;
        }
        return result;
    }

    /**
     * registers a resource template with a config object and callback.
     * @param {string} name         the name of the resource
     * @param {ResourceTemplate} uriOrTemplate    the URI or Template.
     * @param {object} config   the resource configuration 
     * @param {Function} callback   the callback function.
     * @returns {boolean} true if register; else false.
     * @example 
     *  Application Config:
     *  "config",
     *  new ResourceTemplate("users://{userId}/profile", { list: undefined }),,
        {
            title: "User Profile",
            description: "User profile information",
            mimeType: "text/plain"
        },
        async (uri, { userId }) => ({
            contents: [{
                uri: uri.href,
                text: `Profile data for user ${userId}`
            }]
        })
     */
    registerResourceTemplate(
        name: string,
        uriOrTemplate: ResourceTemplate,
        config: {
            title?: string;
            description?: string;
            mimeType?: string;
        },
        callback: any
    ): boolean {
        let result: boolean = false;
        try {
            let registeredResource: RegisteredResource | RegisteredResourceTemplate = this.mcp.registerResource(
                name,
                uriOrTemplate,
                {
                    title: config.title,
                    description: config.description,
                    mimeType: config.mimeType
                },
                callback
            );

            // add the resource
            this.resources.push({
                name: name,
                title: config.title,
                description: config.description,
                uri: uriOrTemplate,
                mimeType: config.mimeType
            });
            this.resourcesCallback.push({
                name: name,
                callback: registeredResource.readCallback
            });
            result = true;
        } catch (e) {
            throw e;
        }
        return result;
    }

    /**
     * registers a prompt with a config object and callback.
     * @param {string} name         the name of the prompt
     * @param {object} config   the prompt configuration 
     * @param {Function} callback   the callback function.
     * @returns {boolean} true if register; else false.
     * @example 
     *  Code Review:
     *  "review-code",
        {
            title: "Code Review",
            description: "Review code for best practices and potential issues",
            argsSchema: { code: z.string() }
        },
        ({ code }) => ({
            messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `Please review this code:\n\n${code}`
                }
            }]
        })
     */
    registerPrompt(
        name: string,
        config: {
            title?: string;
            description?: string;
            argsSchema?: any;
        },
        callback: any
    ): boolean {
        let result: boolean = false;
        try {
            let registeredPrompt: RegisteredPrompt = this.mcp.registerPrompt(
                name,
                {
                    title: config.title,
                    description: config.description,
                    argsSchema: config.argsSchema
                },
                callback
            );

            // add the prompt
            this.prompts.push({
                name: name,
                title: config.title,
                description: config.description,
                arguments: config.argsSchema
            });
            this.promptsCallback.push({
                name: name,
                callback: registeredPrompt.callback
            });
            result = true;
        } catch (e) {
            throw e;
        }
        return result;
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
     * call the tool.
     * @param {string} name     the name of the tool
     * @param {object} args     the arguments.
     * @returns {object} the result; else null.
     */
    async callTool(name: string, args: any): Promise<any | null> {

        // try find the tool.
        let mcpToolCallback: McpToolCallback = this.toolsCallback.find(function (item) {
            return (item.name === name || item.name === name);
        })

        // call the tool.
        return await Promise.resolve(mcpToolCallback.callback(args, null));
    }

    /**
     * get the prompt
     * @param {string} name     the name of the prompt
     * @param {object} args     the arguments.
     * @returns {object} the result; else null.
     */
    async callPrompt(name: string, args: any): Promise<any | null> {

        // try find the prompt.
        let mcpPromptCallback: McpPromptCallback = this.promptsCallback.find(function (item) {
            return (item.name === name || item.name === name);
        })

        // call the tool.
        return await Promise.resolve(mcpPromptCallback.callback(args, null));
    }

    /**
     * read the resource.
     * @param {string} name     the name of the resource
     * @param {string} uri  the resource URI.
     * @param {object} args     the arguments if any.
     * @returns {object} the result; else null.
     */
    async callResource(name: string, uri: string, args?: any): Promise<any | null> {

        // try find the resource.
        let mcpResourceCallback: McpResourceCallback = this.resourcesCallback.find(function (item) {
            return (item.name === name || item.name === name);
        })
        let mcpResource: McpResource = this.resources.find(function (item) {
            return (item.name === name || item.name === name);
        })

        // find the uri type
        if (typeof mcpResource.uri === "string") {
            // call the tool.
            return await Promise.resolve(mcpResourceCallback.callback(new URL(uri), null, null));
        }
        else {
            // call the tool.
            return await Promise.resolve(mcpResourceCallback.callback(new URL(uri), args, null));
        }
    }

    /**
     * stop receiving messages.
     */
    async stopServer(): Promise<void> {
        // if open.
        if (this.open) {

            // close all transports
            for (var i = 0; i < this.httpTransports.length; i++) {
                try {
                    // close the transport.
                    this.httpTransports[i].transport.close();
                } catch (e) {
                    var error = e;
                }
            }

            // empty list.
            this.httpTransports = [];

            // init
            this.tools = [];
            this.prompts = [];
            this.resources = [];
            this.toolsCallback = [];
            this.promptsCallback = [];
            this.resourcesCallback = [];

            // close the mcp connection.
            await this.mcp.close();
            this.open = false;
        }
    }

    /**
     * start receiving messages on stdin and sending messages on stdout.
     * For command-line tools and direct integrations.
     */
    async startServerStdio(): Promise<void> {

        // if not open.
        if (!this.open) {
            try {
                // ... set up server resources, tools, and prompts ...
                // before starting server.
                const transport = new StdioServerTransport();
                await this.mcp.connect(transport);
                
                // connection open.
                this.open = true;

            } catch (e) {
                this.open = false;
                throw e;
            }
        }
    }

    /**
     * start receiving messages on streamable HTTP.
     * For remote servers, set up a Streamable HTTP transport that handles 
     * both client requests and server-to-client notifications.
     */
    async startServerHttp(): Promise<void> {

        // if not open.
        if (!this.open) {
            try {
                let self = this;

                // ... set up server resources, tools, and prompts ...
                // before starting server.

                // if no state
                if (!this.httpTransportStateless) {

                    // init new transport.
                    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
                        sessionIdGenerator: () => randomUUID(),
                        onsessioninitialized: (sessionId) => {
                            // Store the transport by session ID
                            self.httpTransports.push({
                                sessionId: sessionId,
                                transport: transport
                            });
                        }
                    });

                    // Clean up transport when closed
                    transport.onclose = () => {
                        if (transport.sessionId) {
                            try {
                                let httpTransportModel: McpHttpTransportModel = self.findHttpTransport(transport.sessionId);
                                if (httpTransportModel) {

                                    // Get the index of the current transport.
                                    let peerIndex = self.httpTransports.indexOf(httpTransportModel);
                                    if (peerIndex > -1) {
                                        self.httpTransports.splice(peerIndex, 1);
                                    }
                                }
                            }
                            catch (e) { }
                        }
                    };

                    // Connect to the MCP server
                    await this.mcp.connect(transport);
                }
                else {
                    // stateless
                    // init new transport.
                    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
                        sessionIdGenerator: undefined
                    });

                    // add this transport.
                    this.httpTransports.push({
                        sessionId: "sessionid",
                        transport: transport
                    });

                    // Connect to the MCP server
                    await this.mcp.connect(transport);
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