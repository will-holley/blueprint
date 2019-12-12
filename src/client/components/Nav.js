// 3rd Party Libs
import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Flex, Box } from '@rebass/grid';
// Config
import routes from '../config/routes';
// Components
import { A } from './tags';

const Container = styled(Flex).attrs({
	width: [1 / 2],
	mb: 4
})`
	//background: linear-gradient(45deg, #3d4f6c 0%, #2222228c 100%);
`;

class Nav extends React.Component {
	renderLink = path => {
		const { label } = routes[path];
		const isCurrent = this.props.location.pathname === path;
		return (
			<Box key={`nav-${path}`} pr={3}>
				<A to={path} current={isCurrent}>
					{label}
				</A>
			</Box>
		);
	};

	render() {
		return (
			<Container as="nav">
				{Object.keys(routes)
					.filter(path => routes[path].nav)
					.map(this.renderLink)}
			</Container>
		);
	}
}

export default withRouter(Nav);
