# https://huggingface.co/microsoft/phi-4
import requests

API_URL = "https://router.huggingface.co/nebius/v1/chat/completions"
headers = {
    "Authorization": "Bearer huggingface-api-key",
}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

response = query({
    "messages": [
        {
            "role": "user",
            "content": "What is the capital of Australia?"
        }
    ],
    "max_tokens": 512,
    "model": "microsoft/phi-4"
})

print(response["choices"][0]["message"])
