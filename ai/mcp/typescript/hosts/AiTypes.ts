/**
* mcp item, config: mcp
*/
export interface McpItem {
	"query"?: string;
	"provider"?: string;
	"model"?: string;
	"max_output_tokens"?: number;
	"temperature"?: number;
	"top_p"?: number;
}
