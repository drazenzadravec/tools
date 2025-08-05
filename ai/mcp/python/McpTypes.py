from pydantic import AnyUrl, TypeAdapter
from typing import Optional, Any, List, Union, Dict

# Model context protocol tool parameters.
class McpToolParameters:
    """
    Model context protocol tool.
    """
    def __init__(self,
                 parameters: dict[str, Any] | None = None):
        self.parameters = parameters

    def __repr__(self):
        return f"McpToolParameters(parameters={self.parameters})"

# Model context protocol tool.
class McpTool:
    """
    Model context protocol tool.
    """
    def __init__(self,
                 name: str,
                 title: str,
                 description: str,
                 inputSchema: Any,
                 parameters: McpToolParameters | None = None):
        self.name = name
        self.title = title
        self.description = description
        self.inputSchema = inputSchema
        self.parameters = parameters

    def __repr__(self):
        return f"McpTool(name={self.name}, " \
            f"title={self.title}, " \
            f"description={self.description}, " \
            f"inputSchema={self.inputSchema}, " \
            f"parameters={self.parameters})"

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

    def __repr__(self):
        return f"McpPrompt(name={self.name}, " \
            f"title={self.title}, " \
            f"description={self.description}, " \
            f"arguments={self.arguments})"

# Model context protocol resource.
class McpResource:
    """
    Model context protocol resource.
    """
    def __init__(self,
                 name: str,
                 title: str,
                 description: str,
                 uri: AnyUrl,
                 mimeType: str):
        self.name = name
        self.title = title
        self.description = description
        self.uri = uri
        self.mimeType = mimeType

    def __repr__(self):
        return f"McpResource(name={self.name}, " \
            f"title={self.title}, " \
            f"description={self.description}, " \
            f"uri={self.uri}, " \
            f"mimeType={self.mimeType})"

# Model context protocol prompt helper.
class McpPromptHelper:
    """
    Model context protocol prompt helper.
    """
    def __init__(self,
                 name: str,
                 prompt: str):
        self.name = name
        self.prompt = prompt

    def __repr__(self):
        return f"McpPromptHelper(name={self.name}, " \
            f"prompt={self.prompt})"

# Model context protocol function tool.
class McpFunctionTool:
    """
    Model context protocol function tool.
    """
    def __init__(self,
                 clientId: str,
                 serverId: str,
                 type: str,
                 name: str,
                 description: str | None = None,
                 strict: bool | None = None,
                 inputSchema: Dict[str, object] | None = None,
                 parameters: McpToolParameters | None = None):
        self.clientId = clientId
        self.serverId = serverId
        self.type = type
        self.name = name
        self.description = description
        self.strict = strict
        self.inputSchema = inputSchema
        self.parameters = parameters

    def __repr__(self):
        return f"McpFunctionTool(name={self.name}, " \
            f"clientId={self.clientId}, " \
            f"serverId={self.serverId}, " \
            f"type={self.type}, " \
            f"description={self.description}, " \
            f"strict={self.strict}, " \
            f"inputSchema={self.inputSchema}, " \
            f"parameters={self.parameters})"