import * as math from 'mathjs';
import { z } from 'zod';

import { McpServerBase } from '../McpServerBase.js';

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
                    expression: z.string()
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
                    expression: z.string()
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
                    result: z.string()
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

        // if all registered.
        return registeredAll;
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