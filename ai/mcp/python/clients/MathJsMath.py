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
        res: Any = await self.callTool("MathExpressionEvaluator", args={"expression": expression})

        # return the result.
        return res;

    async def callMathExpressionEvaluatorPrompt(self, expression: str) -> Union[Any, None]:
        """
        call the math expression evaluator prompt.

        Args:
            expression: the math expression.

        Return:
            the evaluated expression.
        """
        res: Any = await self.callPrompt("MathExpressionEvaluator", args={"expression": expression})

        # return the result.
        return res;

    async def callMathExpressionResultPrompt(self, result: str) -> Union[Any, None]:
        """
        call the math expression result prompt.

        Args:
            result: the math result.

        Return:
            the evaluated result.
        """
        res: Any = await self.callPrompt("MathExpressionResult", args={"result": result})

        # return the result.
        return res;

    async def callMathJsDocsUrlResource(self) -> Union[Any, None]:
        """
        call the MathJs documentation URL resource.

        Return:
            the resource result.
        """
        res: Any = await self.callResource("mathjs://{version}")

        # return the result.
        return res;

    async def callMathJsDocsUrlVsersionResource(self, version: str) -> Union[Any, None]:
        """
        call the MathJs documentation URL resource.

        Args:
            version: the version.

        Return:
            the resource result.
        """
        res: Any = await self.callResource(f"mathjs://doc/{version}/num")

        # return the result.
        return res;
