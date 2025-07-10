from sympy import *
from sympy import sympify

from typing import Optional, Any, List, Union

from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.prompts.base import PromptArgument, Message, TextContent

from ..McpServerBase import McpServerBase, McpPromptHelper

# SymPy Math Expression Evaluator.
class SymPyMath(McpServerBase):
    """
    SymPy math expression evaluator.
    """
    def __init__(self):
        super().__init__("SymPyMathExpression", "1.0.1", "SymPy math expression evaluator", 
                         dict( resources={}, tools={}, prompts={}))

    def registerTool_MathExpressionEvaluator(self) -> bool:
        """
        register tool math expression evaluator.

        Return:
            true if tool registered; else false.
        """
        return self.registerTool(
            "MathExpressionEvaluator", 
            self.mathExpressionEvaluator,
            "Use SymPy to execute the mathematical expressions")

    def registerPrompt_MathExpressionEvaluator(self) -> bool:
        """
        register prompt math expression evaluator.

        Return:
            true if prompt registered; else false.
        """
        return self.registerPrompt(
            "MathExpressionEvaluator",
            self.mathExpressionEvaluatorPrompt,
            "Evaluate the mathematical expression",
            [ PromptArgument(name = "expression", description = "the math expression", required = True) ]
        )

    def registerPrompt_MathExpressionResult(self) -> bool:
        """
        register prompt math expression result.

        Return:
            true if prompt registered; else false.
        """
        return self.registerPrompt(
            "MathExpressionResult",
            self.mathExpressionResultPrompt,
            "Describe the expression result",
            [ PromptArgument(name = "result", description = "the math evaluated result", required = True) ]
        )

    def registerResource_SymPyDocsUrl(self) -> bool:
        """
        register resource sympy documentation URL.

        Return:
            true if resource registered; else false.
        """
        return self.registerResource(
            "MathExpressionSymPyDocsUrl",
            "sympy://{version}",
            self.mathExpressionSymPyDocsUrlResource,
            "Get the SymPy documentation URL",
            "text/plain"
        )

    def registerResource_SymPyDocsUrl_Version(self) -> bool:
        """
        register resource sympy documentation URL version.

        Return:
            true if resource registered; else false.
        """
        return self.registerResource(
            "MathExpressionSymPyDocsUrlVersion",
            "sympy://doc/{version}/num",
            self.mathExpressionSymPyDocsUrlResource,
            "Get the SymPy documentation URL version",
            "text/plain"
        )

    def mathExpressionEvaluatorPrompt(self, expression: str) -> List[Message]:
        """
        prompt math expression evaluator.

        Args:
            expression:    expression to evaluate.

        Return:
            the prompt result.
        """
        return [ 
            Message(
                role = "user", 
                content = TextContent(
                    type = "text", 
                    text = f"evaluate the math expression: {expression}")
            )
        ]

    def mathExpressionResultPrompt(self, result: str) -> List[Message]:
        """
        prompt math expression result.

        Args:
            result:    expression to evaluate.

        Return:
            the prompt result.
        """
        return [ 
            Message(
                role = "user", 
                content = TextContent(
                    type = "text", 
                    text = f"describe the result: {result}, using latex")
            )
        ]

    def mathExpressionEvaluator(self, expression: str) -> str:
        """
        math expression evaluator.

        Args:
            expression:    expression to evaluate.

        Return:
            the expression result.
        """
        result = ""
        
        try:
            expr = sympify(expression)
            result = expr.evalf(15)
        except Exception as e:
            try:
                expr = sympify(expression)
                result = str(expr)
            except Exception as e:
                result = f"error: {e}"

        # return the result.
        return result

    def mathExpressionSymPyDocsUrlResource(self) -> str:
        """
        SymPy documentation URL resource math expression result.

        Return:
            the resource result.
        """
        return f"https://docs.sympy.org/latest/index.html"

    def register(self) -> bool:
        """
        register all tools, prompts, resources.

        Return:
            true if registered; else false.
        """
        registeredAll: bool = True

        # ternary conditional statement.
        # register tools.
        registeredAll = True if (self.registerTool_MathExpressionEvaluator() and registeredAll) else False
        registeredAll = True if (self.registerPrompt_MathExpressionEvaluator() and registeredAll) else False
        registeredAll = True if (self.registerPrompt_MathExpressionResult() and registeredAll) else False
        registeredAll = True if (self.registerResource_SymPyDocsUrl() and registeredAll) else False
        registeredAll = True if (self.registerResource_SymPyDocsUrl_Version() and registeredAll) else False

        # if all registered.
        return registeredAll

    def getPromptHelpers(self) -> List[McpPromptHelper]:
        """
        get the list of prompt helpers.

        Return:
            the list of prompt helpers.
        """
        prompts: List[McpPromptHelper] = [];

        # add prompt.
        prompts.append(McpPromptHelper(
            "MathExpressionEvaluator",
            "evaluate the math expression: {expression}"
        ))

        prompts.append(McpPromptHelper(
            "MathExpressionResult",
            "describe the result: {result}, using latex"
        ))

        # return the helper list.
        return prompts

# if main.
def mainSymPyMathServer(useStreamableHttp: bool = False) -> SymPyMath | None:
    """
    start the SymPy math server.

    Args:
            useStreamableHttp:    use streamable HTTP to receiving messages.
    """
    # start server.
    sympymath_server = SymPyMath()

    # if registered
    if (sympymath_server.register()):
        # start server.
        if (useStreamableHttp):
            sympymath_server.startServerHttp()
        else:
            sympymath_server.startServerStdio()

        # return the server.
        return sympymath_server
    else:
        return None
