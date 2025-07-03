import { McpClient } from '../McpClient.js';

/**
 * SymPy Math Expression Evaluator.
 */
export class SymPyMath extends McpClient {

    /**
     * SymPy Math Expression Evaluator.
     */
    constructor() {
        super("SymPyMathExpressionEvaluator", "1.0.1");
    }

    /**
     * call the math expression evaluator tool.
     * @param {string} expression     the math expression.
     * @returns {Promise<any>} the evaluated expression.
     */
    async callMathExpressionEvaluatorTool(expression: string): Promise<any> {
        let result: any = await this.callTool("MathExpressionEvaluator", {
            expression: expression
        });

        // return the result.
        return result;
    }
}