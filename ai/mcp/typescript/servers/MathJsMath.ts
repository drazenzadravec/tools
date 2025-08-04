import * as math from 'mathjs';
import { z } from 'zod';
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

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

    /**
     * register tool math expression evaluator.
     * @returns {boolean} true if register; else false.
     */
    registerTool_MathExpressionEvaluator(): boolean {

        let localThis = this;
        return this.registerTool(
            "MathExpressionEvaluator",
            {
                description: "Use MathJS to execute the mathematical expressions",
                inputSchema: {
                    expression: z.string().describe("the MathJs mathematical expression")
                }
            },
            async ({ expression }) => ({
                content: [{
                    type: "text",
                    text: localThis.mathExpressionEvaluator(expression)
                }]
            })
        );
    }

    /**
     * register prompt math expression evaluator.
     * @returns {boolean} true if register; else false.
     */
    registerPrompt_MathExpressionEvaluator(): boolean {

        return this.registerPrompt(
            "MathExpressionEvaluator",
            {
                description: "Use MathJS to execute the mathematical expressions",
                argsSchema: {
                    expression: z.string().describe("the MathJs mathematical expression")
                }
            },
            async ({ expression }) => ({
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `evaluate the math expression: ${expression}`
                    }
                }]
            })
        );
    }

    /**
     * register prompt math expression result.
     * @returns {boolean} true if register; else false.
     */
    registerPrompt_MathExpressionResult(): boolean {

        return this.registerPrompt(
            "MathExpressionResult",
            {
                description: "Describe the expression result.",
                argsSchema: {
                    result: z.string().describe("the expression result")
                }
            },
            async ({ result }) => ({
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `describe the result: ${result}, using latex`
                    }
                }]
            })
        );
    }

    /**
     * register resource mthjs documentation URL.
     * @returns {boolean} true if register; else false.
     */
    registerResource_MathJsDocsUrl(): boolean {

        return this.registerResource(
            "MathExpressionMathJsDocsUrl",
            "mathjs://{version}",
            {
                title: "MathExpressionMathJsDocsUrl",
                description: "Get the MathJs documentation URL",
                mimeType: "text/plain"
            },
            async (uri) => ({
                contents: [{
                    uri: uri.href,
                    mimeType: "text/plain",
                    text: "https://mathjs.org/docs/index.html"
                }]
            })
        )
    }

    /**
     * register resource mthjs documentation URL version.
     * @returns {boolean} true if register; else false.
     */
    registerResource_MathJsDocsUrl_Version(): boolean {

        return this.registerResourceTemplate(
            "MathExpressionMathJsDocsUrlVersion",
            new ResourceTemplate("mathjs://doc/{version}/num", { list: undefined }),
            {
                title: "MathExpressionMathJsDocsUrlVersion",
                description: "Get the MathJs documentation URL version",
                mimeType: "text/plain"
            },
            async (uri, { version }) => ({
                contents: [{
                    uri: uri.href,
                    mimeType: "text/plain",
                    text: `The document version ${version}`
                }]
            })
        )
    }

    /**
     * math expression evaluator.
     * @param {string} expression   the expression to evaluate.
     * @returns {string}    the expression result.
     */
    mathExpressionEvaluator(expression: string): string {
        let result: string = "";

        try {
            let ans: any = math.evaluate(expression);
            result = math.format(ans);

        } catch (e) {
            result = `error: ${e}`;
        }

        // return the result.
        return result;
    }

    /**
     * register all tools, prompts, resources.
     * @returns {boolean}    true if registered; else false.
     */
    register(): boolean {
        let registeredAll: boolean = true;

        // ternary conditional statement.
        // register tools.
        registeredAll = this.registerTool_MathExpressionEvaluator() && registeredAll ? true : false;
        registeredAll = this.registerPrompt_MathExpressionEvaluator() && registeredAll ? true : false;
        registeredAll = this.registerPrompt_MathExpressionResult() && registeredAll ? true : false;
        registeredAll = this.registerResource_MathJsDocsUrl() && registeredAll ? true : false;
        registeredAll = this.registerResource_MathJsDocsUrl_Version() && registeredAll ? true : false;

        // if all registered.
        return registeredAll;
    }

    /**
     * get the list of prompt helpers.
     * @returns {Array<McpPromptHelper>} the list of prompt helpers.
     */
    getPromptHelpers(): Array<McpPromptHelper> {
        let prompts: Array<McpPromptHelper> = [];

        // add prompt
        prompts.push({
            name: "MathExpressionEvaluator",
            prompt: "evaluate the math expression: {expression}"
        });

        prompts.push({
            name: "MathExpressionEvaluator",
            prompt: "evaluate the math expression: {expression}, leave expression unchanged"
        });

        prompts.push({
            name: "MathExpressionResult",
            prompt: "describe the result: {result}, using latex"
        });

        // return the helper list.
        return prompts;
    }
}

/**
 * start the MathJs math server.
 * @param {boolean} useStreamableHttp   use streamable HTTP to receiving messages.
 * @param {boolean} stateless  set the http transport stateless value; true if stateless; else has state.
 * @returns {MathJsMath}    MathJsMath server; else null.
 */
export async function mainMathJsMathServer(useStreamableHttp: boolean = false, stateless: boolean = true): Promise<MathJsMath | undefined> {

    // start server.
    let mathjsmath_server: MathJsMath = new MathJsMath();
    
    // set state
    mathjsmath_server.setHttpTransportStateless(stateless);

    // if registered
    if (mathjsmath_server.register()) {
        // start server.
        if (useStreamableHttp) {
            await mathjsmath_server.startServerHttp();
        }
        else {
            await mathjsmath_server.startServerStdio();
        }

        // return the server.
        return mathjsmath_server;
    }
    else {
        return null;
    }
}