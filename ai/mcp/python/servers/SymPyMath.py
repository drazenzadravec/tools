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
def mainSymPyMathServer():
    """
    start the SymPy math server.
    """
    # start server.
    sympymath_server = SymPyMath()

    # register tools.
    tool_MathExpressionEvaluator: bool = sympymath_server.registerTool_MathExpressionEvaluator()

    # if registered
    if (tool_MathExpressionEvaluator):

        # start server.
        sympymath_server.startServerStdio()
    else:
        print("Error: failed to start server")
