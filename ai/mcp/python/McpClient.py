import httpx

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.client.streamable_http import streamablehttp_client

from pydantic import AnyUrl, TypeAdapter
from typing import Optional, Any, List, Union, Callable, Dict
from contextlib import AsyncExitStack

from .McpTypes import McpTool, McpPrompt, McpResource, McpToolParameters

# Model context protocol client.
class McpClient:
    """
    Model context protocol client.
    """
    def __init__(self):
        self.open = False
        self.logEvent: Callable[[str, str, str, Any], None] | None = None

        # Initialize session and client objects
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()

        # init
        self.tools: List[McpTool] = []
        self.prompts: List[McpPrompt] = []
        self.resources: List[McpResource] = []

    def onEvent(self, event: Callable[[str, str, str, Any], None]) -> None:
        """
        subscribe to the on event.
        Args:
            event:   the log event handler.
        """
        self.logEvent = event

    def isConnected(self) -> bool:
        """
        is connected to MCP server.

        Return:
            true if connected to server; else false.
        """
        return self.open

    def getTools(self) -> List[McpTool]:
        """
        get the list of tools

        Return:
            the list of tools; else empty.
        """
        return self.tools

    def getPrompts(self) -> List[McpPrompt]:
        """
        get the list of prompts

        Return:
            the list of prompts; else empty.
        """
        return self.prompts

    def getResources(self) -> List[McpResource]:
        """
        get the list of resources

        Return:
            the list of resources; else empty.
        """
        return self.resources

    async def callTool(self, name: str, args: Dict[str, Any] | None = None) -> Any | None:
        """
        call the tool.

        Args:
            name:    the name of the tool
            args:    the arguments

        Return:
            the result; else none.
        """
        # if open.
        if self.open:
            return await self.session.call_tool(name, arguments = args)
        else:
            return None

    async def callPrompt(self, name: str, args: Dict[str, str] | None = None) -> Any | None:
        """
        read the resource.

        Args:
            name:    the name of the prompt
            args:    the arguments

        Return:
            the result; else none.
        """
        # if open.
        if self.open:
            return await self.session.get_prompt(name, arguments = args)
        else:
            return None

    async def callResource(self, uri: AnyUrl) -> Any | None:
        """
        read the resource.

        Args:
            uri:    the resource URI

        Return:
            the result; else none.
        """
        # if open.
        if self.open:
            return await self.session.read_resource(uri)
        else:
            return None

    async def closeConnection(self):
        """
        disconnect from the MCP server.
        """
        self.session = None
        self.tools = []
        self.prompts = []
        self.resources = []

        try:
            # close the stack.
            await self.exit_stack.aclose()
        except Exception as e:
            if (self.logEvent):
                self.logEvent("error", "mcpclient", "client close", e)

        # closed
        self.logEvent = None
        self.open = False

    async def openConnectionStdio(self, serverScriptPath: str):
        """
        connect to the MCP server.
        start receiving messages on stdin and sending messages on stdout.

        Args:
            serverScriptPath: the server script full path
        """

        # if not open.
        if not self.open:
            try:

                # only if JavaScript or Python
                is_python = serverScriptPath.endswith('.py')
                is_js = serverScriptPath.endswith('.js')

                # if not JavaScript and not Python
                if not (is_python or is_js):
                    raise ValueError("Server script must be a .py or .js file")

                # the command to execute
                command = "python" if is_python else "node"
                server_params = StdioServerParameters(
                    command = command,
                    args = [serverScriptPath],
                    env = None
                )

                # open a connection to the MCP server.
                stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))
                self.read, self.write = stdio_transport
                self.session = await self.exit_stack.enter_async_context(ClientSession(self.read, self.write))

                # start session.
                await self.session.initialize()
                
                # client connected.
                self.open = True

                # request.
                await self.requestTools()
                await self.requestPrompts()
                await self.requestResources()

            except Exception as e:
                self.open = False
                if (self.logEvent):
                    self.logEvent("error", "open", "open connection stdio", e)
                raise  # Re-throws the same exception

    async def openConnectionStdioCustom(self, command: str, argsList: List[str] | None = None, envList: Dict[str, str] | None = None):
        """
        connect to the MCP server.
        start receiving messages on stdin and sending messages on stdout.

        Args:
            command: the executable to run to start the server.
            argsList: command line arguments to pass to the executable.
            envList: the environment to use when spawning the process.
        """

        # if not open.
        if not self.open:
            try:

                # the command to execute
                server_params = StdioServerParameters(
                    command = command,
                    args = argsList,
                    env = envList
                )

                # open a connection to the MCP server.
                stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))
                self.read, self.write = stdio_transport
                self.session = await self.exit_stack.enter_async_context(ClientSession(self.read, self.write))

                # start session.
                await self.session.initialize()
                
                # client connected.
                self.open = True

                # request.
                await self.requestTools()
                await self.requestPrompts()
                await self.requestResources()

            except Exception as e:
                self.open = False
                if (self.logEvent):
                    self.logEvent("error", "open", "open connection stdio custom", e)
                raise  # Re-throws the same exception

    async def openConnectionStdioServerParam(self, server: StdioServerParameters):
        """
        connect to the MCP server.
        start receiving messages on stdin and sending messages on stdout.

        Args:
            server: stdio server parameters.
        """

        # if not open.
        if not self.open:
            try:

                # open a connection to the MCP server.
                stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server))
                self.read, self.write = stdio_transport
                self.session = await self.exit_stack.enter_async_context(ClientSession(self.read, self.write))

                # start session.
                await self.session.initialize()
                
                # client connected.
                self.open = True

                # request.
                await self.requestTools()
                await self.requestPrompts()
                await self.requestResources()

            except Exception as e:
                self.open = False
                if (self.logEvent):
                    self.logEvent("error", "open", "open connection stdio server param", e)
                raise  # Re-throws the same exception

    async def openConnectionHttp(self, serverUrl: str, requestInit: Dict[str, str] | None = None):
        """
        connect to the MCP server.
        start receiving messages on streamable HTTP.
        For remote servers, set up a Streamable HTTP transport that handles
        both client requests and server-to-client notifications.

        Args:
            serverUrl: the server URL path.
            requestInit:    ustomizes HTTP requests to the server.

        Example:
            serverUrl:  https://example.com/mcp
            requestInit: {
                'Authorization': 'Bearer <secret>'
            }
        """

        # if not open.
        if not self.open:
            try:
                http_transport = None

                # open a connection to the MCP server.
                if(requestInit is None):
                    http_transport = await self.exit_stack.enter_async_context(streamablehttp_client(serverUrl))
                else:
                    http_transport = await self.exit_stack.enter_async_context(
                        streamablehttp_client(url=serverUrl, headers=requestInit))

                # get streams
                self.read, self.write, _, = http_transport
                self.session = await self.exit_stack.enter_async_context(ClientSession(self.read, self.write))
                
                # Initialize the connection
                await self.session.initialize()
                
                # client connected.
                self.open = True

                # request.
                await self.requestTools()
                await self.requestPrompts()
                await self.requestResources()
                
            except Exception as e:
                self.open = False
                if (self.logEvent):
                    self.logEvent("error", "open", "open connection http", e)
                raise  # Re-throws the same exception

    async def openConnectionHttpCustom(self, serverUrl: str, headers: Dict[str, str] | None = None, auth: httpx.Auth | None = None):
        """
        connect to the MCP server.
        start receiving messages on streamable HTTP.
        For remote servers, set up a Streamable HTTP transport that handles
        both client requests and server-to-client notifications.

        Args:
            serverUrl: the server URL path.
            headers:    ustomizes HTTP requests to the server.
            auth:    ustomizes HTTP authorization to the server.

        Example:
            serverUrl:  https://example.com/mcp
            headers: {
                'Authorization': 'Bearer <secret>'
            }
        """

        # if not open.
        if not self.open:
            try:
                http_transport = None

                # open a connection to the MCP server.
                http_transport = await self.exit_stack.enter_async_context(
                    streamablehttp_client(url=serverUrl, headers=headers, auth=auth))
                
                # get streams
                self.read, self.write, _, = http_transport
                self.session = await self.exit_stack.enter_async_context(ClientSession(self.read, self.write))
                
                # Initialize the connection
                await self.session.initialize()
                
                # client connected.
                self.open = True

                # request.
                await self.requestTools()
                await self.requestPrompts()
                await self.requestResources()
                
            except Exception as e:
                self.open = False
                if (self.logEvent):
                    self.logEvent("error", "open", "open connection http custom", e)
                raise  # Re-throws the same exception

    async def requestTools(self) -> bool:
        """
        request the tools list.

        Return:
            true if list call succeeded: else false.
        """
        haslist: bool = False

        # if open.
        if self.open:
            self.tools = []

            try:
                # load all tools.
                toolsResult = await self.session.list_tools()
                if toolsResult is not None:
                    if toolsResult.tools is not None:
                        for tool in toolsResult.tools:
                            # create the tool model.
                            self.tools.append(McpTool(
                                tool.name,
                                tool.name,
                                tool.description,
                                tool.inputSchema,
                                McpToolParameters(tool.inputSchema)
                            ))

                haslist = True
            except Exception as e:
                if (self.logEvent):
                    self.logEvent("error", "tools", "request tools", e)

        return haslist

    async def requestPrompts(self) -> bool:
        """
        request the prompts list.

        Return:
            true if list call succeeded: else false.
        """
        haslist: bool = False

        # if open.
        if self.open:
            self.prompts = []

            try:
                # load all prompts.
                promptsResult = await self.session.list_prompts()
                if promptsResult is not None:
                    if promptsResult.prompts is not None:
                        for prompt in promptsResult.prompts:
                            # create the prompt model.
                            self.prompts.append(McpPrompt(
                                prompt.name,
                                prompt.name,
                                prompt.description,
                                prompt.arguments
                            ))

                haslist = True
            except Exception as e:
                if (self.logEvent):
                    self.logEvent("error", "prompts", "request prompts", e)

        return haslist

    async def requestResources(self) -> bool:
        """
        request the resources list.

        Return:
            true if list call succeeded: else false.
        """
        haslist: bool = False

        # if open.
        if self.open:
            self.resources = []

            try:
                # load all resources.
                resourcesResult = await self.session.list_resources()
                if resourcesResult is not None:
                    if resourcesResult.resources is not None:
                        for resource in resourcesResult.resources:
                            # create the resource model.
                            self.resources.append(McpResource(
                                resource.name,
                                resource.name,
                                resource.description,
                                resource.uri,
                                resource.mimeType
                            ))

                haslist = True
            except Exception as e:
                haslist = False
                if (self.logEvent):
                    self.logEvent("error", "resources", "request resources", e)

            try:
                # load all resources.
                resourcesResultTemplates = await self.session.list_resource_templates()
                if resourcesResultTemplates is not None:
                    if resourcesResultTemplates.resourceTemplates is not None:
                        for resource in resourcesResultTemplates.resourceTemplates:
                            # create the resource model.
                            self.resources.append(McpResource(
                                resource.name,
                                resource.name,
                                resource.description,
                                resource.uriTemplate,
                                resource.mimeType
                            ))

                haslist = True
            except Exception as e:
                haslist = False
                if (self.logEvent):
                    self.logEvent("error", "resources_templates", "request resource templates", e)
        
        return haslist