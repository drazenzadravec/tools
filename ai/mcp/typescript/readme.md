## TypeScript MCP Implementation

Includes base client and server classes which can be inherited by custom classes. <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank">typescript-sdk</a>

### Client
```typescript
import { McpClient } from '../McpClient.js';

/**
 * MathJs Math Expression Evaluator.
 */
export class MathJsMathClient extends McpClient {

    /**
     * MathJs Math Expression Evaluator.
     */
    constructor() {
        super("MathJsMathExpressionEvaluator", "1.0.1");
    }
}
```

### Server
```typescript
import {
    McpServerBase,
} from '../McpServerBase.js';
import {
    McpPromptHelper
} from '../McpTypes.js';

/**
 * MathJs Math Expression Evaluator.
 */
export class MathJsMath extends McpServerBase {

    /**
     * MathJs Math Expression Evaluator.
     */
    constructor() {
        super("MathJsMathExpression", "1.0.1", "MathJs math expression evaluator",
            { resources: {}, tools: {}, prompts: {} });
    }
}
```
