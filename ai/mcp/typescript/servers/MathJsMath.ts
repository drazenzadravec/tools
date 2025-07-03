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
        super("MathJsMathExpression", "1.0.1", "MathJs math expression evaluator", { resources: {}, tools: {} });
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
                description: "Use MathJS to execute mathematical expressions",
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
}

/**
 * start the MathJs math server.
 */
export async function mainMathJsMathServer(): Promise<void> {

    // start server.
    let mathjsmath_server: MathJsMath = new MathJsMath();

    // register tools.
    let tool_MathExpressionEvaluator: boolean = mathjsmath_server.registerTool_MathExpressionEvaluator();

    // if registered
    if (tool_MathExpressionEvaluator) {
        // start server.
        await mathjsmath_server.startServerStdio();
    }
    else {
        console.log("Error: failed to start server");
    }
}
