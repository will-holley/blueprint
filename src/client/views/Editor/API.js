import { Value } from 'slate';

class LocalStorage {
	constructor(documentId = 'content') {
		// The identifier for this document
		this.identifier = documentId;
	}

	static read() {
		return localStorage.getItem(this.identifier);
	}

	static write(data) {
		localStorage.setItem(this.identifier, data);
	}
}

/**
 * TODO: refactor to fetch from the database
 * @return {object} :: [description]
 */
const fetchDocument = () => {
	// Check local storage for existing value
	const defaultValue = {
		document: {
			nodes: [
				{
					object: 'block',
					type: 'paragraph',
					nodes: [
						{
							object: 'text',
							leaves: [
								{
									text: 'A line of text in a paragraph.'
								}
							]
						}
					]
				}
			]
		}
	};
	const storedLocally = LocalStorage.read();
	const value = storedLocally ? JSON.parse(storedLocally) : defaultValue;
	return Value.fromJSON(value);
};

const saveDocument = data => {
	const content = JSON.stringify(data.toJSON());
	LocalStorage.write(content);
};

export { fetchDocument, saveDocument };
