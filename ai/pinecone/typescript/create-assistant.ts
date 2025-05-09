/**
 * create assistant
 * @returns the result
 */
async function create() {

	// make the request.
	let response: Response = await fetch("https://api.pinecone.io/assistant/assistants",
		{
			method: 'POST',
			headers: {
				"Api-Key": "pinecone-api-key",
				"content-type": "application/json"
			},
			body: JSON.stringify(
				{
					"name": "embeddings-index-002",
					"instructions": "When answering the question or responding, use the context provided, if it is provided and relevant."
				}
			)
		});

	// get the JSON
	let data: any = await response.json();
	console.log(data);
}
