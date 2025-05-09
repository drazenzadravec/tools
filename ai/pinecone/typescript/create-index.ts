import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
	apiKey: 'pinecone-api-key'
});

// Create a serverless index
const indexName = "embeddings-index-002"

/**
 * create embeddings index 002
 */
async function creatEembeddingsIndex002(): Promise<void> {

    let result = await pc.createIndex({
        name: indexName,
        dimension: 1024,
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1'
            }
        }
    });
}
