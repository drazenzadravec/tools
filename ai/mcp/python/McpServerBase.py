from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from pydantic import AnyUrl, TypeAdapter
from typing import Optional, Any, List, Union, Callable, Awaitable

from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.resources import Resource, ResourceTemplate
from mcp.server.fastmcp.resources.types import FunctionResource
from mcp.server.fastmcp.prompts.base import Prompt, PromptArgument, PromptResult
from mcp.server.fastmcp.resources.templates import ResourceTemplate

from .McpTypes import McpTool, McpPrompt, McpResource

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

    def __repr__(self):
        return f"McpServerBase(name={self.name}, " \
            f"instructions={self.instructions}, " \
            f"stateless={self.stateless}, " \
            f"version={self.version})"


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
                     callback: Callable[..., Any],
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
                     uri: AnyUrl,
                     callback: Callable[[], Any],
                     description: str | None = None,
                     mimeType: str | None = None) -> bool:
        """
        registers a resource with a config object and callback.

        Args:
            name:  the name of the resource
            uri:    the URI
            callback:   the callback function, does not take any parameters.
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
            # new resource 
            functionResource: FunctionResource = FunctionResource(
                uri = uri,
                name = name,
                description = description,
                mime_type = mimeType,
                fn = callback
            )

            # create from function.
            self.mcp.add_resource(functionResource)
            result = True
        except Exception as e:
            raise

        return result

    def registerResourceTemplate(self, 
                     name: str, 
                     uri: AnyUrl,
                     callback: Callable[..., Any],
                     description: str | None = None,
                     mimeType: str | None = None) -> bool:
        """
        registers a resource template with a config object and callback.

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
            lambda (uri, { userId }) => ({
                contents: [{
                    uri: uri.href,
                    text: f"Profile data for user {userId}"
                }]
            }),
            "Application configuration data",
            "text/plain"
        """
        result: bool = False
        try:
            # new resource 
            resourceTemplate: ResourceTemplate = self.mcp._resource_manager.add_template(
                callback, uri, name, description, mimeType)
            result = True
        except Exception as e:
            raise

        return result

    def registerPrompt(self, 
                     name: str, 
                     callback: Callable[..., PromptResult | Awaitable[PromptResult]],
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

    async def getTools(self) -> List[McpTool]:
        """
        get the list of tools

        Return:
            the list of tools; else empty.
        """
        tools: List[McpTool] = [];

        try:
            # load all tools.
            toolsResult = await self.mcp.list_tools()
            if toolsResult is not None:
                for tool in toolsResult:
                    # create the tool model.
                    tools.append(McpTool(
                        tool.name,
                        tool.name,
                        tool.description,
                        tool.inputSchema
                    ))
        except Exception as etools:
            list_error: bool = True
        
        return tools

    async def getPrompts(self) -> List[McpPrompt]:
        """
        get the list of prompts

        Return:
            the list of prompts; else empty.
        """
        prompts: List[McpPrompt] = [];
        
        try:
            # load all prompts.
            promptsResult = await self.mcp.list_prompts()
            if promptsResult is not None:
                for prompt in promptsResult:
                    # create the prompt model.
                    prompts.append(McpPrompt(
                        prompt.name,
                        prompt.name,
                        prompt.description,
                        prompt.arguments
                    ))
        except Exception as eprompts:
            list_error: bool = True

        return prompts

    async def getResources(self) -> List[McpResource]:
        """
        get the list of resources

        Return:
            the list of resources; else empty.
        """
        resources: List[McpResource] = [];

        try:
            # load all resources.
            resourcesResult = await self.mcp.list_resources()
            if resourcesResult is not None:
                for resource in resourcesResult:
                    # create the resource model.
                    resources.append(McpResource(
                        resource.name,
                        resource.name ,
                        resource.description,
                        resource.uri,
                        resource.mimeType
                    ))
        except Exception as eresources:
            list_error: bool = True

        return resources

    async def callTool(self, name: str, args: dict[str, Any] | None = None) -> Union[Any, None]:
        """
        call the tool.

        Args:
            name:    the name of the tool
            args:    the arguments

        Return:
            the result; else none.
        """
        return await self.mcp.call_tool(name, arguments = args)

    async def callPrompt(self, name: str, args: dict[str, str] | None = None) -> Union[Any, None]:
        """
        read the resource.

        Args:
            name:    the name of the prompt
            args:    the arguments

        Return:
            the result; else none.
        """
        return await self.mcp.get_prompt(name, arguments = args)

    async def callResource(self, uri: AnyUrl) -> Union[Any, None]:
        """
        read the resource.

        Args:
            uri:    the resource URI

        Return:
            the result; else none.
        """
        return await self.mcp.read_resource(uri)

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
