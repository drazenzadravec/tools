async function query(data) {
	const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
		{
			headers: {
				Authorization: "Bearer huggingface-api-key",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);

	console.log(response);
	const result = await response.json();
	return result;
}

query({ "inputs": "The square root of x is the cube root of y. What is y to the power of 2, if x = 4?" }).then((response) => {
	//console.log(JSON.stringify(response));
	console.log(response);
});
