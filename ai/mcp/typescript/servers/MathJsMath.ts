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
 * @param {boolean} useStreamableHttp   use streamable HTTP to receiving messages.
 * @param {boolean} stateless  set the http transport stateless value; true if stateless; else has state.
 * @returns {MathJsMath}    MathJsMath server; else null.
 */
export async function mainMathJsMathServer(useStreamableHttp: boolean = false, stateless: boolean = true): Promise<MathJsMath | undefined> {

    // start server.
    let mathjsmath_server: MathJsMath = new MathJsMath();
    let registeredAll: boolean = true;

    // set state
    mathjsmath_server.setHttpTransportStateless(stateless);

    // ternary conditional statement.
    // register tools.
    registeredAll = mathjsmath_server.registerTool_MathExpressionEvaluator() && registeredAll ? true : false;

    // if registered
    if (registeredAll) {
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