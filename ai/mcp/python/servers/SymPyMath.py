from sympy import *
from sympy import sympify

from ..McpServerBase import McpServerBase

# SymPy Math Expression Evaluator.
class SymPyMath(McpServerBase):
    """
    SymPy math expression evaluator.
    """
    def __init__(self):
        super().__init__("SymPyMathExpression", "1.0.1", "SymPy math expression evaluator", dict( resources={}, tools={}))

    def registerTool_MathExpressionEvaluator(self) -> bool:
        """
        register tool math expression evaluator.

        Return:
            true if tool registered; else false.
        """
        return self.registerTool(
            "MathExpressionEvaluator", 
            self.mathExpressionEvaluator,
            "Use SymPy to execute mathematical expressions")

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

# if main.
def mainSymPyMathServer(useStreamableHttp: bool = False) -> SymPyMath | None:
    """
    start the SymPy math server.

    Args:
            useStreamableHttp:    use streamable HTTP to receiving messages.
    """
    # start server.
    sympymath_server = SymPyMath()
    registeredAll: bool = True

    # ternary conditional statement.
    # register tools.
    registeredAll = True if (sympymath_server.registerTool_MathExpressionEvaluator() and registeredAll) else False

    # if registered
    if (registeredAll):
        # start server.
        if (useStreamableHttp):
            sympymath_server.startServerHttp()
        else:
            sympymath_server.startServerStdio()

        # return the server.
        return sympymath_server
    else:
        return None
