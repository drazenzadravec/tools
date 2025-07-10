from pydantic import AnyUrl, TypeAdapter
from typing import Optional, Any, List, Union

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

    def __repr__(self):
        return f"McpTool(name={self.name}, " \
            f"title={self.title}, " \
            f"description={self.description}, " \
            f"inputSchema={self.inputSchema})"

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
