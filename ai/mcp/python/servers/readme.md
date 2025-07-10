## MCP Servers

### SymPy
SymPy server, mathematical expression evaluator.

### Sample
```python
import asyncio
import sys

# add search path
sys.path.append("../publish/")

from nequeo.ai.mcp.servers.SymPyMath import SymPyMath, mainSymPyMathServer

async def main():

    sympymathServer = SymPyMath()

    print(sympymathServer.registerTool_MathExpressionEvaluator())
    print(sympymathServer.registerPrompt_MathExpressionEvaluator())
    print(sympymathServer.registerResource_SymPyDocsUrl())
    print(sympymathServer.registerResource_SymPyDocsUrl_Version())

    print(await sympymathServer.callPrompt("MathExpressionEvaluator", args={"expression": "cos(0)"}))
    print(await sympymathServer.callTool("MathExpressionEvaluator", args={"expression": "integrate(x**2, x)"}))
    print(await sympymathServer.callResource("sympy://{version}"))
    print(await sympymathServer.callResource("sympy://doc/777777/num"))

    print(await sympymathServer.getPrompts())
    print(await sympymathServer.getTools())
    print(await sympymathServer.getResources())

if __name__ == "__main__":
    asyncio.run(main())
```
