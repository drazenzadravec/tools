## Python MCP Implementation

Includes a base client and server class which can be inherited by custom classes.

### Client
```python
from ..McpClient import McpClient

# SymPy Math Expression Evaluator.
class SymPyMath(McpClient):
    """
    SymPy Math Expression Evaluator.
    """
    def __init__(self):
        super().__init__()
```

### Server
```python
from ..McpServerBase import McpServerBase
from ..McpTypes import McpPromptHelper

# SymPy Math Expression Evaluator.
class SymPyMath(McpServerBase):
    """
    SymPy math expression evaluator.
    """
    def __init__(self):
        super().__init__("SymPyMathExpression", "1.0.1", "SymPy math expression evaluator", 
                         dict( resources={}, tools={}, prompts={}))
```
