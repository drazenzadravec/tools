## MCP Hosts

### OpenAI
OpenAI Host implementation

```typescript
import { McpItem } from './AiTypes.js';
import { executeProvider } from './provider.js';

import {
	McpHost,
} from '../McpHost.js';

import { createMcpHost } from './hostMain.js';

// get the json
let requestBody: any = JSON.parse(event.body);
let mcpPrompt: McpItem = requestBody as McpItem;
let mcpHost: McpHost = await createMcpHost();

// process the query.
let { result, results } = await executeProvider(mcpPrompt, mcpHost);

// close the connection.
await mcpHost.closeAll();
```
