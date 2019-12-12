import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import styled from 'styled-components';

const Container = styled(Flex).attrs({
	mb: 4
})``;

const IconContainer = styled(Box).attrs({
	mr: 2
})`
	cursor: pointer;
`;

const Icon = styled.a``;

class Controls extends React.Component {
	static propTypes = {};

	get icons() {
		return [
			{
				id: 'bold',
				altText: 'bold',
				onClick: () => {
					console.log('bold');
				},
				glyph: ''
			},
			{
				id: 'italic',
				altText: 'italic',
				onClick: () => {
					console.log('italic');
				},
				glyph: ''
			},
			{
				id: 'underline',
				altText: 'underline',
				onClick: () => {
					console.log('underline');
				},
				glyph: ''
			},
			{
				id: 'strikethrough',
				altText: 'strikethrough',
				onClick: () => {
					console.log('strikethrough');
				},
				glyph: ''
			},
			{
				id: 'code',
				altText: 'code',
				onClick: () => {
					console.log('code');
				},
				glyph: ''
			}
		];
	}

	renderIcons = () => {
		return this.icons.map(({ id, altText, onClick, glyph }) => (
			<IconContainer key={`control-icon-${id}`} onClick={onClick}>
				<Icon>{glyph ? glyph : altText}</Icon>
			</IconContainer>
		));
	};

	render() {
		return <Container>{this.renderIcons()}</Container>;
	}
}

export default Controls;
