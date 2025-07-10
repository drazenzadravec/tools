## MCP Servers

### MathJs
MathJs server, mathematical expression evaluator.

## Sample
```typescript
import { MathJsMath } from './MathJsMath.js';

// create the server
const mathjsmathServer = new MathJsMath();
mathjsmathServer.register();

console.log(mathjsmathServer.getPrompts());
console.log(mathjsmathServer.getTools());
console.log(mathjsmathServer.getResources());

console.log(await mathjsmathServer.callTool("MathExpressionEvaluator",
    {
        expression: "5^5"
    }));

console.log((await mathjsmathServer.callPrompt("MathExpressionEvaluator",
    {
        expression: "5^5"
    })).messages[0]);

console.log((await mathjsmathServer.callPrompt("MathExpressionResult",
    {
        result: "234"
    })).messages[0]);

console.log((await mathjsmathServer.callResource("MathExpressionMathJsDocsUrl", "mathjs://{version}")));

const versionNumber: string = "678.345";
console.log((await mathjsmathServer.callResource("MathExpressionMathJsDocsUrlVersion", `mathjs://doc/${versionNumber}/num`,
    {
        version: versionNumber
    })));
```
