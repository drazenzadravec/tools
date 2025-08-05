import {
    ToolCallback,
    PromptCallback,
    ReadResourceCallback,
    ReadResourceTemplateCallback,
    ResourceTemplate
} from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    StreamableHTTPServerTransport
} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
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
    "parameters"?: McpToolParameters;
}

/**
 * Model context protocol tool parameters. 
 */
export interface McpToolParameters {
    "properties"?: any;
    "required"?: Array<string>;
    "type"?: string;
    "additionalProperties"?: boolean;
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
 * mcp function tool
 */
export interface McpFunctionTool {
    clientId: string;
    serverId: string;
    type: string;
    name: string;
    description?: string | null;
    strict: boolean;
    inputSchema?: Record<string, unknown>;
    parameters?: McpToolParameters;
}