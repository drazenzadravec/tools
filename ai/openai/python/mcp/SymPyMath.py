import sys
import openai
import json
import asyncio

# add search path
sys.path.append("../publish/")

from nequeo.ai.mcp.clients.SymPyMath import SymPyMath

# supply your API key however you choose
openai.api_key = "OPENAI-API-KEY"

async def main():
    """
    run math.
    """

    # the math to evaluate.
    mathExpression = "integrate(x**2, x)";

    # the tools
    tools = [
        {
            "type": "function",  
            "name": "MathExpressionEvaluator",
            "description": "Use SymPy to execute the mathematical expression",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "the SymPy mathematical expression"
                    }
                },
                "required": [
                    "expression"
                ],
                "additionalProperties": False
            }
        }    
    ]

    # run the AI
    response = openai.responses.create(
        model = "gpt-4.1-nano",
        input = [
            {
                "role": "user",
                "content": f"evaluate the math expression: {mathExpression}"
            }
        ],
        tools = tools
    )

    #print(response)

    # if out
    if (response.output):
        """
        if output
        """
        for tool in response.output:
            if (tool.name == "MathExpressionEvaluator" and tool.type == "function_call"):

                # connect to the server from the client.
                sympymathClient = SymPyMath()
                await sympymathClient.openConnectionStdio("PATH-TO-SYMPY-SERVER")

                # call the tool
                result = await sympymathClient.callMathExpressionEvaluatorTool(json.loads(tool.arguments)["expression"])
                await sympymathClient.closeConnection()

                # display result.
                print(result.content[0].text)

                # run the AI on result
                responseEval = openai.responses.create(
                    model = "gpt-4.1-nano",
                    input = [
                        {
                            "role": "user",
                            "content": f"Describe the result: {result.content[0].text}, using latex"
                        }
                    ]
                )

                # print response.
                print(responseEval.output_text)

if __name__ == "__main__":
    asyncio.run(main())
