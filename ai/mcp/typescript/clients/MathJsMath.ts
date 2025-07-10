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

    /**
     * call the math expression evaluator tool.
     * @param {string} expression     the math expression.
     * @returns {Promise<any>} the evaluated expression.
     */
    async callMathExpressionEvaluatorTool(expression: string): Promise<any> {
        let res: any = await this.callTool("MathExpressionEvaluator", {
            expression: expression
        });

        // return the result.
        return res;
    }

    /**
     * call the math expression evaluator prompt.
     * @param {string} expression     the math expression.
     * @returns {Promise<any>} the evaluated expression.
     */
    async callMathExpressionEvaluatorPrompt(expression: string): Promise<any> {
        let res: any = await this.callPrompt("MathExpressionEvaluator", {
            expression: expression
        });

        // return the result.
        return res;
    }

    /**
     * call the math expression result prompt.
     * @param {string} result     the math result.
     * @returns {Promise<any>} the evaluated result.
     */
    async callMathExpressionResultPrompt(result: string): Promise<any> {
        let res: any = await this.callPrompt("MathExpressionResult", {
            result: result
        });

        // return the result.
        return res;
    }

    /**
     * call the MathJs documentation URL resource.
     * @returns {Promise<any>} the evaluated result.
     */
    async callMathJsDocsUrlResource(): Promise<any> {
        let res: any = await this.callResource("mathjs://{version}");

        // return the result.
        return res;
    }

    /**
     * call the MathJs documentation URL resource.
     * @param {string} version     the version.
     * @returns {Promise<any>} the evaluated result.
     */
    async callMathJsDocsUrlVersionResource(version: string): Promise<any> {
        let res: any = await this.callResource(`mathjs://doc/${version}/num`);

        // return the result.
        return res;
    }
}