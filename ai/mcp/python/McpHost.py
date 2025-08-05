from typing import Optional, Any, List, Union, Dict

from .McpClient import McpClient
from .McpServerBase import McpServerBase
from .McpTypes import McpTool, McpFunctionTool

# Model context protocol client model.
class McpClientModel:
    """
    Model context protocol client model.
    """
    def __init__(self,
                 id: str,
                 client: McpClient):
        self.id = id
        self.client = client

    def __repr__(self):
        return f"McpClientModel(id={self.id}, " \
            f"client={self.client})"

# Model context protocol server model.
class McpServerModel:
    """
    Model context protocol server model.
    """
    def __init__(self,
                 id: str,
                 server: McpServerBase):
        self.id = id
        self.server = server

    def __repr__(self):
        return f"McpServerModel(id={self.id}, " \
            f"server={self.server})"

# Model context protocol host.
class McpHost:
    """
    Model context protocol host.
    """
    def __init__(self):
        # init
        self.mcpClients: List[McpClientModel] = [];
        self.mcpServers: List[McpServerModel] = [];
        self.mcpFunctionTools: List[McpFunctionTool] = [];

    def getClients(self) -> List[McpClientModel]:
        """
        get the list of clients

        Return:
            list of clients
        """
        return self.mcpClients

    def getServers(self) -> List[McpServerModel]:
        """
        get the list of servers

        Return:
            list of servers
        """
        return self.mcpServers

    def getFunctionTools(self) -> List[McpFunctionTool]:
        """
        get the list of function tools

        Return:
            list of function tools
        """
        return self.mcpFunctionTools

    def addClient(self, id: str, client: McpClient):
        """
        add an MCP client.

        Args:
            id: the unique id.
            client: the mcp client.
        """
        self.mcpClients.append(McpClientModel(
                id,
                client
            ))

    def addServer(self, id: str, server: McpServerBase):
        """
        add an MCP server.

        Args:
            id: the unique id.
            server: the mcp server.
        """
        self.mcpServers.append(McpServerModel(
                id,
                server
            ))

    def addFunctionTool(self, tool: McpTool, clientId: str, serverId: str):
        """
        add an MCP function tool.

        Args:
            tool: the mcp tool.
            clientId: the mcp client Id.
            serverId: the mcp server Id.
        """
        self.mcpFunctionTools.append(McpFunctionTool(
                clientId,
                serverId,
                "function",
                tool.name,
                tool.description,
                True,
                tool.inputSchema,
                tool.parameters
            ))

    def findClient(self, id: str) -> McpClientModel | None:
        """
        find an MCP client.

        Args:
            id: the unique id.

        Return:
            the mcp client; else empty
        """
        found: bool = False
        clientModel: McpClientModel = None

        # for each
        for client in self.mcpClients:
            if id == client.id:
                found = True
                clientModel = client
                break

        # return
        return clientModel

    def findServer(self, id: str) -> McpServerModel | None:
        """
        find an MCP server.

        Args:
            id: the unique id.

        Return:
            the mcp server; else empty
        """
        found: bool = False
        serverModel: McpServerModel = None

        # for each
        for server in self.mcpServers:
            if id == server.id:
                found = True
                serverModel = server
                break

        # return
        return serverModel

    def findFunctionTool(self, name: str) -> McpFunctionTool | None:
        """
        find an MCP function tool.

        Args:
            name: the unique name.

        Return:
            the mcp function tool; else empty
        """
        found: bool = False
        functionTool: McpFunctionTool = None

        # for each
        for tool in self.mcpFunctionTools:
            if name == tool.name:
                found = True
                functionTool = tool
                break

        # return
        return functionTool