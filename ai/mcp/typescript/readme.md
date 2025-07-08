## TypeScript MCP Sample

```typescript
import { MathJsMathClient } from './clients/MathJsMath.js';

// connect to the server from the client.
const mathjsmathClient = new MathJsMathClient();
var open = await mathjsmathClient.openConnectionStdio("./servers/MathJsMath.js");

// call the tool
var result = await mathjsmathClient.callMathExpressionEvaluatorTool("6^4");
var resultPrompt = await mathjsmathClient.callMathExpressionEvaluatorPrompt("6^4");
var resultPrompt1 = await mathjsmathClient.callMathExpressionResultPrompt("6565");
await mathjsmathClient.closeConnection();

// display result.
console.log(result.content[0].text);
console.log(resultPrompt.messages);
console.log(resultPrompt1.messages);


```typescript
import { MathJsMathClient } from './clients/MathJsMath.js';

// connect to the server from the client.
const mathjsmathClient = new MathJsMathClient();
var open = await mathjsmathClient.openConnectionHttp(
    "https://example.com/mcp",
    {
        headers: {
            'Authorization': 'Bearer <secret>'
        }
    });

// call the tool
var result = await mathjsmathClient.callMathExpressionEvaluatorTool("sin(pi/2)");
var result3 = await mathjsmathClient.callMathExpressionEvaluatorTool("cos(pi)");
var resultPrompt = await mathjsmathClient.callMathExpressionEvaluatorPrompt("6^4");
var resultPrompt1 = await mathjsmathClient.callMathExpressionResultPrompt("6565");
await mathjsmathClient.closeConnection();

// display result.
console.log(result.content[0].text);
console.log(result3.content[0].text);
console.log(resultPrompt.messages);
console.log(resultPrompt1.messages);
