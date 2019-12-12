import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
  	font-size: 62.5%;
  	box-sizing: border-box;
	}
	*, *:before, *:after {
  	box-sizing: inherit;
  	padding: 0;
  	margin: 0;
  	font-family: inherit;
  	color: inherit;
  	-webkit-font-smoothing: antialiased;
  	-moz-osx-font-smoothing: grayscale;
	}
	body {
		font-family: sans-serif;
		font-size: 1.6rem;
		min-height: 100vh;
		// Project Defaults ^
		// Typography
		// Layout
		padding: 50px;
		// Colors
		background: linear-gradient(45deg,#003bc6 0%,#00319b 100%);
		color: white;
	}
`;

export default GlobalStyle;
