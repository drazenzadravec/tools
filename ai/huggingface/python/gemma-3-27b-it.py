#https://huggingface.co/google/gemma-3-27b-it
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
            "content": [
                {
                    "type": "text",
                    "text": "Describe this image in one sentence."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg"
                    }
                }
            ]
        }
    ],
    "max_tokens": 512,
    "model": "google/gemma-3-27b-it-fast"
})

print(response["choices"][0]["message"])
