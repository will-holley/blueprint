import { createGlobalStyle } from "styled-components";

// Import fonts
// TODO: clean all this up!
import InterRegularWoffTwo from "./../static/fonts/inter/Inter-Regular.woff2";
import InterRegularWoff from "./../static/fonts/inter/Inter-Regular.woff";
import InterMediumWoffTwo from "./../static/fonts/inter/Inter-Medium.woff2";
import InterMediumWoff from "./../static/fonts/inter/Inter-Medium.woff";
import InterBoldWoffTwo from "./../static/fonts/inter/Inter-Bold.woff2";
import InterBoldWoff from "./../static/fonts/inter/Inter-Bold.woff";

const GlobalStyle = createGlobalStyle`

	// Setup font faces
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: normal;
    src:
      url('${InterRegularWoffTwo}') format('woff2'),
      url('${InterRegularWoff}') format('woff');
	}
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    src:
      url('${InterMediumWoffTwo}') format('woff2'),
      url('${InterMediumWoff}') format('woff');
	}
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: bold;
    src:
      url('${InterBoldWoffTwo}') format('woff2'),
      url('${InterBoldWoff}') format('woff');
	}

	// Declarations
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
		font-family: 'Inter', sans-serif;
		font-size: 1.6rem;
		min-height: 100vh;
		// Project Defaults ^
		// Typography
		// Layout
		// Colors
		background: ${({ theme }) => theme.background};
		color: ${({ theme }) => theme.text.color};
	}
`;

export default GlobalStyle;
