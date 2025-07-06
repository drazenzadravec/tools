from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from typing import Optional, Any, List, Union

from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.resources.base import Resource
from mcp.server.fastmcp.prompts.base import Prompt, PromptArgument

# Model context protocol tool.
class McpTool:
    """
    Model context protocol tool.
    """
    def __init__(self,
                 name: str,
                 title: str,
                 description: str,
                 inputSchema: Any):
        self.name = name
        self.title = title
        self.description = description
        self.inputSchema = inputSchema

# Model context protocol prompt.
class McpPrompt:
    """
    Model context protocol prompt.
    """
    def __init__(self,
                 name: str,
                 title: str,
                 description: str,
                 arguments: Any):
        self.name = name
        self.title = title
        self.description = description
        self.arguments = arguments

# Model context protocol resource.
class McpResource:
    """
    Model context protocol resource.
    """
    def __init__(self,
                 name: str,
                 title: str,
                 description: str,
                 uri: str,
                 mimeType: str):
        self.name = name
        self.title = title
        self.description = description
        self.uri = uri
        self.mimeType = mimeType

# Model context protocol server base.
class McpServerBase:
    """
    Model context protocol server base.
    """
    def __init__(self,
                 name: str,
                 version: str,
                 instructions: str,
                 capabilities: Any,
                 stateless: bool = True):
        """
        Args:
            name:    server name
            version:    server version
            instructions:    server instructions
            capabilities:    server capabilities
            stateless:       is http stateless: true: else false (default is true).

        Example:
            name: "weather",
            version: "1.0.0",
            instructions: "Use this server for....",
            capabilities: {
                resources: {},
                tools: {},
                prompts: {}
            }
        """
        self.open = False

        self.name = name
        self.version = version
        self.instructions = instructions
        self.capabilities = capabilities
        self.stateless = stateless

        # Create an MCP server
        self.mcp: FastMCP = FastMCP(name, instructions=instructions, stateless_http=stateless, json_response=True)

    def hasStarted(self) -> bool:
        """
        has to MCP server started.

        Return:
            true if started; else false.
        """
        return self.open

    def getMcpServer(self) -> FastMCP:
        """
        get the MCP server, used to register Tools, Resource, Prompts.

        Return:
            the MCP server.
        """
        return self.mcp

    def registerTool(self, 
                     name: str, 
                     callback: Any,
                     description: str | None = None,
                     annotations: Any | None = None) -> bool:
        """
        registers a tool with a config object and callback.

        Args:
            name:  the name of the tool
            callback:   the callback function.
            description:    the tool description
            annotations:    additional tool information

        Return:
            true if tool is registered; else false.

        Example:
            "add",
            lambda a, b: ({
                content: [{ type: "text", text: str(a + b) }]
            }),
            "Add two numbers",
            annotations: {
                title: str | None = None  #A human-readable title for the tool.
            }
        """
        result: bool = False
        try:
            self.mcp.add_tool(callback, name, description, annotations)
            result = True
        except Exception as e:
            raise

        return result

    def registerResource(self, 
                     name: str, 
                     uri: str,
                     callback: Any,
                     description: str | None = None,
                     mimeType: Any | None = None) -> bool:
        """
        registers a resource with a config object and callback.

        Args:
            name:  the name of the resource
            uri:    the URI
            callback:   the callback function.
            description:    the resource description
            mimeType:    the mime type

        Return:
            true if resource is registered; else false.

        Example:
            "config",
            "config://app",
            lambda uri: ({
                contents: [{
                    uri: uri.href,
                    text: "App configuration here"
                }]
            }),
            "Application configuration data",
            "text/plain"
        """
        result: bool = False
        try:
            self.mcp.add_resource(Resource(
                callback,
                uri,
                name,
                description,
                mimeType
            ))
            result = True
        except Exception as e:
            raise

        return result

    def registerPrompt(self, 
                     name: str, 
                     callback: Any,
                     description: str | None = None,
                     argsSchema: List[PromptArgument] | None = None) -> bool:
        """
        registers a prompt with a config object and callback.

        Args:
            name:  the name of the prompt
            callback:   the callback function.
            description:    the prompt description
            argsSchema:    args schema

        Return:
            true if prompt is registered; else false.

        Example:
            "review-code",
            lambda code: ({
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: f"code: {code}"
                    }
                }]
            }),
            "Review code for best practices and potential issues",
            [
                {
                    name: string;
                    description?: string;
                    required?: boolean; 
                }
            ]
        """
        result: bool = False
        try:
            self.mcp.add_prompt(Prompt(
                name = name,
                description = description,
                arguments = argsSchema,
                fn = callback
            ))
            result = True
        except Exception as e:
            raise

        return result

    def stopServer(self):
        """
        stop receiving messages on stdin and sending messages on stdout
        """
        # if open.
        if self.open:
            self.mcp = None
            self.open = False

    def startServerStdio(self):
        """
        start receiving messages on stdin and sending messages on stdout.
        For command-line tools and direct integrations.
        """
        # if not open.
        if not self.open:
            try:
                # ... set up server resources, tools, and prompts ...
                # before starting server.
                self.mcp.run(transport='stdio')

                # connection open.
                self.open = True

            except Exception as e:
                self.open = False
                raise  # Re-throws the same exception

    def startServerHttp(self):
        """
        start receiving messages on streamable HTTP.
        For remote servers, set up a Streamable HTTP transport that handles
        both client requests and server-to-client notifications.
        """
        # if not open.
        if not self.open:
            try:
                # ... set up server resources, tools, and prompts ...
                # before starting server.
                self.mcp.run(transport="streamable-http")

                # connection open.
                self.open = True

            except Exception as e:
                self.open = False
                raise  # Re-throws the same exception
