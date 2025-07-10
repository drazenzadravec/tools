## TypeScript MCP Implementation

Includes a base client and server class which can be inherited be classes.

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
