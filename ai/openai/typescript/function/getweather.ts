import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: "OPENAI-API-KEY",
    organization: "ORG-KEY"
});

let tools = [{
    "type": "function",
    "name": "get_weather",
    "description": "Get current temperature for a given location.",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "City and country e.g. Bogota, Colombia"
            }
        },
        "required": [
            "location"
        ],
        "additionalProperties": false
    },
    strict: true
}];

const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    input: [{ role: "user", content: "What is the weather like in Sydney today?" }],
    tools: tools
});

console.log(response.output);
