import { OpenAI } from "openai";
import { MathJsMathClient } from '../../ai/mcp/clients/MathJsMath.js';

const openai = new OpenAI({
    apiKey: "OPENAI_API_KEY",
    organization: "OPENAI-ORG"
});

// the math to evaluate.
let mathExpression: string = "4^45";

// the tools
let tools = [
    {
        "type": "function",
        "name": "MathExpressionEvaluator",
        "description": "Use MathJs to execute the mathematical expression",
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "the MathJs mathematical expression"
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
    /*tools: tools*/
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
            const mathjsmathClient = new MathJsMathClient();
            var open = await mathjsmathClient.openConnectionStdio("PATH-TO-MATHJS_SERVER");
            var result = await mathjsmathClient.callMathExpressionEvaluatorTool(JSON.parse(tool.arguments).expression);
            await mathjsmathClient.closeConnection()

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
