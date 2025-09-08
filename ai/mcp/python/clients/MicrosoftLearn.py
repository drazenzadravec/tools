from typing import Optional, Any, List, Union

from ..McpClient import McpClient
from ..McpTypes import McpTool

# Microsoft learn.
class MicrosoftLearn(McpClient):
    """
    Microsoft learn.
    """
    def __init__(self):
        super().__init__()

    async def openMicrosoftLearn(self) -> None:
        """
        open microsoft learn connection.
        """
        try:
            # open a new connection.
            await self.openConnectionHttp("https://learn.microsoft.com/api/mcp")

            # change the required parameter
            tools: List[McpTool] = self.getTools()
            for tool in tools:
                if tool.parameters.parameters["required"] is None:
                    # change
                    tool.parameters.parameters["required"] = ['query', 'question']

        except Exception as e:
            if (self.logEvent):
                self.logEvent("error", "openmicrosoftlearn", "could not open the connection", e)