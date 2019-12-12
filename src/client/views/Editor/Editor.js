import React from 'react';
import PropTypes from 'prop-types';
import { Editor as Slate } from 'slate-react';
import { Flex, Box } from '@rebass/grid';
// Nodes
// Marks
import { hotkeyPlugin, hotkeyRenderer } from './Marks/Hotkeys';
// API
import { fetchDocument, saveDocument } from './API';
// UI
import Controls from './Controls';

const plugins = [...hotkeyPlugin];

class Editor extends React.Component {
	state = {
		value: null
	};

	componentWillMount() {
		const value = fetchDocument();
		this.setState({ value });
	}

	// On change, update the app's React state with the new editor value.
	handleChange = ({ value }) => {
		// Check to see if the document has changed before saving.
		if (value.document != this.state.value.document) {
			saveDocument(value);
		}
		// Update View
		this.setState({ value });
	};

	// Add a `renderNode` method to render a `CodeNode` for code blocks.
	renderNode = (props, editor, next) => {
		return next();
	};

	renderMark = (props, editor, next) => {
		const markType = props.mark.type;
		// Hotkeys
		if (markType in hotkeyRenderer) {
			const renderer = hotkeyRenderer[markType];
			return renderer(props);
		}

		return next();
	};

	render() {
		return (
			<Flex flexDirection="column">
				<Box>
					<Controls />
				</Box>
				<Box>
					<Slate
						plugins={plugins}
						value={this.state.value}
						onChange={this.handleChange}
						renderNode={this.renderNode}
						renderMark={this.renderMark}
					/>
				</Box>
			</Flex>
		);
	}
}

export default Editor;
