from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from pydantic import AnyUrl, TypeAdapter, BaseModel, Field
from typing import Optional, Any, List, Union, Callable, Awaitable, Dict

from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.tools.base import Tool
from mcp.server.fastmcp.resources import Resource
from mcp.server.fastmcp.resources.types import FunctionResource
from mcp.server.fastmcp.prompts.base import Prompt, PromptArgument, PromptResult
from mcp.server.fastmcp.resources.templates import ResourceTemplate

from .McpTypes import McpTool, McpPrompt, McpResource, McpToolParameters

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
        self.logEvent: Callable[[str, str, str, Any], None] | None = None

        self.name = name
        self.version = version
        self.instructions = instructions
        self.capabilities = capabilities
        self.stateless = stateless

        # Create an MCP server
        self.mcp: FastMCP = FastMCP(name=name, 
                                    instructions=instructions, 
                                    stateless_http=stateless, 
                                    json_response=True)
        self.mcp._mcp_server.version = self.version

    def __repr__(self):
        return f"McpServerBase(name={self.name}, " \
            f"instructions={self.instructions}, " \
            f"stateless={self.stateless}, " \
            f"version={self.version})"

    def onEvent(self, event: Callable[[str, str, str, Any], None]) -> None:
        """
        subscribe to the on event.
        Args:
            event:   the log event handler.
        """
        self.logEvent = event

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
            if (self.logEvent):
                self.logEvent("error", "tools", "register tool", e)
            #raise

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
            if (self.logEvent):
                self.logEvent("error", "resources", "register resource", e)
            #raise

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
            if (self.logEvent):
                self.logEvent("error", "resource_templates", "register resource template", e)
            #raise

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
            if (self.logEvent):
                self.logEvent("error", "prompts", "register prompt", e)
            #raise

        return result

    def setToolParameters(self, name: str, parameters: Dict[str, Any] = Field(description="JSON schema for tool parameters")) -> None:
        """
        set the tool parameters

        Args:
            name:  the name of the tool
            parameters: JSON schema for tool parameters

        Example:
        {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "the mathematical expression"
                }
            },
            "required": ["expression"],
            "additionalProperties": False
        }
        """
        tool: Tool = self.mcp._tool_manager.get_tool(name)
        tool.parameters = parameters

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
                    
                    # get base tool parameters.
                    toolParm: Tool = self.mcp._tool_manager.get_tool(tool.name)
                    parameters: Dict[str, Any] | None = None
                    if toolParm.parameters is not None:
                        parameters = toolParm.parameters

                    # create the tool model.
                    tools.append(McpTool(
                        tool.name,
                        tool.name,
                        tool.description,
                        tool.inputSchema,
                        McpToolParameters(parameters)
                    ))
        except Exception as e:
            if (self.logEvent):
                self.logEvent("error", "tools", "get tools", e)
        
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
        except Exception as e:
            if (self.logEvent):
                self.logEvent("error", "prompts", "get prompts", e)

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
        except Exception as e:
            if (self.logEvent):
                self.logEvent("error", "resources", "get resources", e)

        try:
            # load all resources.
            resourcesResultTemplate = await self.mcp.list_resource_templates()
            if resourcesResultTemplate is not None:
                for resourceTemplate in resourcesResultTemplate:
                    # create the resource model.
                    resources.append(McpResource(
                        resourceTemplate.name,
                        resourceTemplate.name ,
                        resourceTemplate.description,
                        resourceTemplate.uriTemplate,
                        resourceTemplate.mimeType
                    ))
        except Exception as e:
            if (self.logEvent):
                self.logEvent("error", "resource_templates", "get resource templates", e)

        return resources

    async def callTool(self, name: str, args: Dict[str, Any] | None = None) -> Any | None:
        """
        call the tool.

        Args:
            name:    the name of the tool
            args:    the arguments

        Return:
            the result; else none.
        """
        return await self.mcp.call_tool(name, arguments = args)

    async def callPrompt(self, name: str, args: Dict[str, str] | None = None) -> Any | None:
        """
        read the resource.

        Args:
            name:    the name of the prompt
            args:    the arguments

        Return:
            the result; else none.
        """
        return await self.mcp.get_prompt(name, arguments = args)

    async def callResource(self, uri: AnyUrl) -> Any | None:
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
            self.logEvent = None
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
                if (self.logEvent):
                    self.logEvent("error", "start", "start server stdio", e)
                #raise  # Re-throws the same exception

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
                if (self.logEvent):
                    self.logEvent("error", "start", "start server http", e)
                #raise  # Re-throws the same exception
