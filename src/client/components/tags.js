import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const H1 = styled.h1``;

const H2 = styled.h2``;

const H3 = styled.h3``;

const P = styled.p``;

const A = styled(Link)`
	font-size: 16px;
	font-weight: 400;
	text-decoration: none;
	${props =>
		props.current &&
		`
		cursor:pointer;
		border-bottom: 1px solid;
	`}
`;

A.propTypes = {
	current: PropTypes.bool.isRequired
};

export { H1, H2, H3, P, A };
