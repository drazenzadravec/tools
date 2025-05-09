import openai

# supply your API key however you choose
openai.api_key = "OPENAI_API_KEY"

system_prompt = (
    "You are a math tutor."
    "You will be given a math problem, and you will need to solve it step-by-step."
    "You will need to provide a detailed explanation of the solution, and the equation you used to solve the problem."
)

# Pass the image to the LLM for interpretation  
def get_math_solver(prompt):

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )
    return response


problem = "What is the integral of x to the power of 3, between 0 and 2?, respond in latex format with the math equation only, do not include the answer."
response = get_math_solver("I need to solve the following math problem: " + problem)
print(response['choices'][0]['message']['content'])
print(response)

