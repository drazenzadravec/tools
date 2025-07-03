import { OpenAI } from "openai";
import { SymPyMath } from '../../ai/mcp/clients/SymPyMath.js';

const openai = new OpenAI({
    apiKey: "OPENAI-API-KEY",
    organization: "OPENAI-ORG"
});

// the math to evaluate.
let mathExpression: string = "integrate(x**2, x)";

// the tools
let tools = [
    {
        "type": "function",
        "name": "MathExpressionEvaluator",
        "description": "Use SymPy to execute the mathematical expression",
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
            "additionalProperties": false
        },
        strict: true
    }
];

// run the AI
const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    input: [
        {
            role: "user",
            content: `evaluate the math expression: ${mathExpression}`
        }],
    tools: tools
});

//console.log(response);

// if out
if (response.output) {
    // for each tool
    for (var i = 0; i < response.output.length; i++) {

        // if the math tool was selected.
        var tool: any = response.output[i];
        if (tool.name === "MathExpressionEvaluator" && tool.type === "function_call") {

            // call the MCP math tool
            const sympymathClient = new SymPyMath();
            var open = await sympymathClient.openConnectionStdio("PATH-TO-SYMPY-SERVER");
            var result = await sympymathClient.callMathExpressionEvaluatorTool(JSON.parse(tool.arguments).expression);
            await sympymathClient.closeConnection()

            // display the result.
            console.log(result.content[0].text);

            // run the AI on result
            const responseEval = await openai.responses.create({
                model: "gpt-4.1-nano",
                input: [
                    {
                        role: "user",
                        content: `Describe the result: ${result.content[0].text as string}, using latex`
                    }]
            });

            // print response.
            console.log(responseEval.output_text);
        }
    }
}
