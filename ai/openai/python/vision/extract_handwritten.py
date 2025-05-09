import openai
import base64

# supply your API key however you choose
openai.api_key = "OPENAI-API-KEY"

system_prompt = (
    "The user will provide you an image of a document file. Perform the following actions: "
    "1. extract the handwritten math equation."
    "2. extract the math equation."
    "3. do not solve the math problem."
)

# Function to encode the image
def encode_image(local_image_path):
    with open(local_image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Pass the image to the LLM for interpretation  
def get_vision_response(prompt, image_path):

    # Getting the base64 string
    base64_image = encode_image(image_path)

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", 
                        "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        },
                    },
                ],
            }
        ],
    )
    return response


response = get_vision_response("image contains handwritten math equation", "PATH-TO-YOUR-IMAGE")
print(response['choices'][0]['message']['content'])
print(response)

# "The handwritten math equation is:\n\n\\[\n\\int_{1}^{3} x^3 \\, dx\n\\]"
