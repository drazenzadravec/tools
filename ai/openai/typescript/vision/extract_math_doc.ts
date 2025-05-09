import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "OPENAI-API-KEY",
    organization: "ORG-KEY"
});

const imageFile = path.resolve("PATH-TO-YOUR-IMAGE");

async function makeBase64() {

    const fileBuffer = fs.readFileSync(imageFile);
    const base64String = fileBuffer.toString('base64');
    return base64String;
}

async function main() {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "The user will provide you an image of a document file. Perform the following actions: " +
                    "1. extract the text, math equations and handwritten math equations in the document." +
                    "2. do not solve the math problem." +
                    "3. respond with markdown."
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "document with text and math equations"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${await makeBase64()}`
                        }
                    }
                ]
            }
        ],
        model: "gpt-4o-mini",
    });

    console.log(completion.choices[0].message.content);
    console.log(completion.choices[0]);
}

main();
