import { createGlobalStyle } from "styled-components";

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
		// Colors
		background: ${({ theme }) => theme.background};
		color: ${({ theme }) => theme.text.color};
	}

	[contenteditable] {
		text-align: center;
		&:empty:before {
			content: attr(placeholder);
			display: block;
			font-size: 26px;
		}
		&:focus {
			outline: none;
		}
	}
`;

export default GlobalStyle;
