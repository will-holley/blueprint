import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from '@rebass/grid';

const Container = styled(Flex).attrs({
	mt: '10rem',
	ml: '10rem'
})`
	font-size: 4rem;
	font-weight: 800;
	letter-spacing: 0.11px;
`;

class Prompt extends React.Component {
	constructor(props) {
		super(props);

		this.texts = {
			events: {
				welcome: `Welcome back, William`
			},
			actions: {
				code: 'Write a program'
			}
		};
	}

	get text() {
		// placeholder for now
		return this.texts.events.welcome;
	}

	render() {
		return <Container>{this.text}</Container>;
	}
}

export default Prompt;
