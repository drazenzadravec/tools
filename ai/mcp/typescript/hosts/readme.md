## MCP Hosts

### Host Implementation
This implementation can support any LLM provider, for this sample OpenAI is demonstrated.

```typescript
import { McpItem } from './AiTypes.js';
import { executeProvider } from './provider.js';

import {
	McpHost,
} from '../McpHost.js';

import { createMcpHost } from './hostMain.js';

// get the prompt.
let mcpPrompt: McpItem = {
    query: 'Use MathJs to evaluate math expression: (cos(pi/4) * pi*2)',
    model: 'gpt-5-mini',
    provider: 'openai',
    max_output_tokens: 3000,
    temperature: 1.0,
    top_p: 1.0
};

// create the host (connection to the AI provider service).
let mcpHost: McpHost = await createMcpHost();

// process the query.
let { result, results } = await executeProvider(mcpPrompt, mcpHost);

// close the connection.
await mcpHost.closeAll();

// display the results.
console.log("result: " + result);
console.log("results: " + results);
```
/**
result: success
results: 4.442882938158366
*/
