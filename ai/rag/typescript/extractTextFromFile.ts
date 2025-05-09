import { writeFile, open, readFile, FileHandle } from 'node:fs/promises';
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * extract text from a file
 * @param { filepath: string; filetype: string; } the file parms.
 * @returns {string} the extracted data.
 */
export async function extractTextFromFile({ filepath, filetype, }: { filepath: string; filetype: string; }): Promise<string> {

	// read the file
	const buffer: Buffer = await readFile(filepath);

	// Handle different file types using different modules
	switch (filetype) {

		case "application/pdf":
			const pdfData = await pdfParse(buffer);
			return pdfData.text;

		case "application/docx": // i.e. docx file
			const docxResult = await mammoth.extractRawText({ path: filepath });
			return docxResult.value;

		case "text/markdown":
		case "text/csv":
		case "text/html":
			const html = buffer.toString();
			return NodeHtmlMarkdown.translate(html);

		case "text/plain":
			return buffer.toString();

		default:
			throw new Error("Unsupported file type");
	}
}

/**
 * split the text into chunks of string arrays.
 * @param { text: string; maxCharLength?: number; } the parms
 * @returns {Array<string>} the array of string.
 */
export async function chunkText({ text, maxCharLength = 250 * 4 }: { text: string; maxCharLength?: number; }): Promise<string[]> {

	// Create an empty array to store the pieces
	const chunks: string[] = [];

	// Create a variable to hold the current piece
	let currentChunk = "";

	// Remove any newline characters from the text and split it by periods
	// This assumes that periods mark the end of sentences, which may not be true for some languages
	const sentences = text.replace(/\n/g, " ").split(/([.])/);

	for (const sentence of sentences) {
		// Remove any extra whitespace from the beginning and end of the sentence
		const trimmedSentence = sentence.trim();

		// If the sentence is empty, skip it
		if (!trimmedSentence) continue;

		// Check if adding the sentence to the current piece would make it too long, too short, or just right
		// This uses a tolerance range of 50% of the maximum length to allow some flexibility
		// If the piece is too long, save it and start a new one
		// If the piece is too short, add the sentence and continue
		// If the piece is just right, save it and start a new one
		const chunkLength = currentChunk.length + trimmedSentence.length + 1;
		const lowerBound = maxCharLength - maxCharLength * 0.5;
		const upperBound = maxCharLength + maxCharLength * 0.5;

		if (
			chunkLength >= lowerBound &&
			chunkLength <= upperBound &&
			currentChunk
		) {
			// The piece is just right, so we save it and start a new one
			// We remove any periods or spaces from the beginning of the piece and trim any whitespace
			currentChunk = currentChunk.replace(/^[. ]+/, "").trim();
			// We only push the piece if it is not empty
			if (currentChunk) chunks.push(currentChunk);
			// Reset the current piece
			currentChunk = "";
		} else if (chunkLength > upperBound) {
			// The piece is too long, so save it and start a new one with the sentence
			// Remove any periods or spaces from the beginning of the piece and trim any whitespace
			currentChunk = currentChunk.replace(/^[. ]+/, "").trim();
			// We only push the piece if it is not empty
			if (currentChunk) chunks.push(currentChunk);
			// Set the current piece to the sentence
			currentChunk = trimmedSentence;
		} else {
			// The piece is too short, so add the sentence and continue
			// Add a space before the sentence unless it is a period
			currentChunk += `${trimmedSentence === "." ? "" : " "}${trimmedSentence}`;
		}
	}

	// If there is any remaining piece, save it
	if (currentChunk) {
		chunks.push(currentChunk);
	}

	// Return the array of pieces
	return chunks;
}

/**
 * split the text into chunks of string arrays.
 * @param { text: string; chunkSize?: number; chunkOverlap?: number; separator?: string; } the parms
 * @returns {Array<string>} the array of string.
 */
export async function chunkTextSplitter({ text, chunkSize = 1024, chunkOverlap = 128, separator = "\n" }: {
	text: string;
	chunkSize?: number;
	chunkOverlap?: number;
	separator?: string;
}): Promise<string[]> {

	// Create an empty array to store the pieces
	var chunks: string[] = [];

	// get the chuncks
	const splitter = new CharacterTextSplitter({
		chunkSize: chunkSize,
		chunkOverlap: chunkOverlap,
		separator: separator
	});

	// assign the result.
	var splitTextList = await splitter.splitText(text);

	// for each item.
	for (const item of splitTextList) {

		// remove \n before adding.
		// \s+ is a regular expression that matches one or more whitespace characters.
		const line = item.replace(/\n/g, " ").replace(/\s+/g, " ");

		// Remove any extra whitespace from the beginning and end of the sentence
		const trimmedLine = line.trim();

		// If the sentence is empty, skip it
		if (!trimmedLine) continue;

		// add.
		chunks.push(trimmedLine);
	}

	// Return the array of pieces
	return chunks;
}

/**
 * split the text into chunks of string arrays.
 * @param { text: string; chunkSize?: number; chunkOverlap?: number; separators?: string[]; } the parms
 * @returns {Array<string>} the array of string.
 */
export async function chunkRecursiveTextSplitter({ text, chunkSize = 1024, chunkOverlap = 128, separators = ["\n"] }: {
	text: string;
	chunkSize?: number;
	chunkOverlap?: number;
	separators?: string[];
}): Promise<string[]> {

	// Create an empty array to store the pieces
	var chunks: string[] = [];

	// get the chuncks
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: chunkSize,
		chunkOverlap: chunkOverlap,
		separators: separators
	});

	// assign the result.
	var splitTextList = await splitter.splitText(text);

	// for each item.
	for (const item of splitTextList) {

		// remove \n before adding.
		// \s+ is a regular expression that matches one or more whitespace characters.
		const line = item.replace(/\n/g, " ").replace(/\s+/g, " ");

		// Remove any extra whitespace from the beginning and end of the sentence
		const trimmedLine = line.trim();

		// If the sentence is empty, skip it
		if (!trimmedLine) continue;

		// add.
		chunks.push(trimmedLine);
	}

	// Return the array of pieces
	return chunks;
}
