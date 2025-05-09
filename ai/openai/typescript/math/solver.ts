import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "OPENAI-API-KEY",
    organization: "ORG-KEY"
});

async function main(prompt: string) {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a math tutor.\n" +
                    "You will be given a math problem, and you will need to solve it step-by-step.\n" +
                    "You will need to provide a detailed explanation of the solution, and the equation you used to solve the problem."
            },
            {
                role: "user",
                "content": prompt
            }
        ],
        model: "gpt-4o-mini",
    });

    console.log(completion.choices[0].message.content);
    console.log(completion.choices[0]);
}

let problem: string = "What is the integral of x to the power of 3, between 0 and 2?, respond in latex format with the math equation only, do not include the answer.";
main("I need to solve the following math problem: " + problem);
