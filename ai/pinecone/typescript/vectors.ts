import {
	Pinecone,
	EmbeddingsList
} from '@pinecone-database/pinecone';

const pc = new Pinecone({
	apiKey: 'pinecone-api-key'
});

// Convert the text into numerical vectors that Pinecone can index
const model = 'multilingual-e5-large';

// Create a serverless index
const indexName = "embeddings-index-002"

// Create a serverless index
const namespace = "index.name"

/**
 * get the vector embeddings for the text.
 * @param {Array<string>} text the text items
 * @returns {object} the response.
 */
export async function vector_embedding_large(text: Array<string>): Promise<EmbeddingsList> {

	// get embeddings
	let embeddings: EmbeddingsList = await pc.inference.embed(
		model,
		text,
		{
			inputType: 'passage',
			truncate: 'END'
		}
	);

	// return the embedings.
	return embeddings;
}

/**
 * insert the embedding data.
 * @param {object} embedding_data the embeddings data.
 * @returns {object} the response.
 */
export async function insert_embedding_large(embedding_data: any): Promise<any> {

	// Target the index where you'll store the vector embeddings
	let index = pc.index(indexName);

	// Upsert the vectors into the index
	await index.namespace(namespace).upsert(embedding_data);

	// return
	return true
}

/**
* query the embedding data.
* @param {Array<string>} query the query.
* @param {number} top the number of matches to returm.
* @returns {object} the response.
*/
export async function query_embedding_large(query: Array<string>, top: number = 20): Promise<any> {

	// Target the index where you'll store the vector embeddings
	let index = pc.index(indexName);

	// Convert the query into a numerical vector that Pinecone can search with
	let queryEmbedding: EmbeddingsList = await pc.inference.embed(
		model,
		query,
		{
			inputType: 'query'
		}
	);

	// Search the index for the most similar vectors.
	let queryResponse = await index.namespace(namespace).query({
		topK: top,
		vector: queryEmbedding[0].values,
		includeValues: false,
		includeMetadata: true
	});

	// return the response.
	return queryResponse;
}
