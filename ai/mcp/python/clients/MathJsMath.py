from typing import Optional, Any, List, Union

from ..McpClient import McpClient

# MathJs Math Expression Evaluator.
class MathJsMath(McpClient):
    """
    MathJs Math Expression Evaluator.
    """
    def __init__(self):
        super().__init__()

    async def callMathExpressionEvaluatorTool(self, expression: str) -> Union[Any, None]:
        """
        call the math expression evaluator tool.

        Args:
            expression: the math expression.

        Return:
            the evaluated expression.
        """
        result: Any = await self.callTool("MathExpressionEvaluator", args={"expression": expression})

        # return the result.
        return result;
