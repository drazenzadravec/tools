### Python Samples

```python
import asyncio
import sys

from .clients.SymPyMath import SymPyMath

async def main():

    try:
        # connect to the server from the client.
        sympymathClient = SymPyMath()
        await sympymathClient.openConnectionStdio("./servers/SymPyMath.py")

        # call the tool
        result = await sympymathClient.callMathExpressionEvaluatorTool("integrate(x**2, x)")
        resultPrompt = await sympymathClient.callMathExpressionEvaluatorPrompt("integrate(x**2, x)")
        resultPrompt1 = await sympymathClient.callMathExpressionResultPrompt("x**3")
        await sympymathClient.closeConnection()

        # display result.
        print(result.content[0].text)
        print(resultPrompt.messages)
        print(resultPrompt1.messages)
        
    except Exception as e:
        error: bool = True

if __name__ == "__main__":
    asyncio.run(main())
```

```python
import asyncio
import sys

from .clients.SymPyMath import SymPyMath

async def main():

    try:
        # connect to the server from the client.
        sympymathClient = SymPyMath()
        await mathjsmathClient.openConnectionHttp(
            "https://example.com/mcp",
            {
                "Authorization": 'Bearer <secret>'
            }
        )

        # call the tool
        result = await sympymathClient.callMathExpressionEvaluatorTool("integrate(x**2, x)")
        resultPrompt = await sympymathClient.callMathExpressionEvaluatorPrompt("integrate(x**2, x)")
        resultPrompt1 = await sympymathClient.callMathExpressionResultPrompt("x**3")
        await sympymathClient.closeConnection()

        # display result.
        print(result.content[0].text)
        print(resultPrompt.messages)
        print(resultPrompt1.messages)
        
    except Exception as e:
        error: bool = True

if __name__ == "__main__":
    asyncio.run(main())
```
