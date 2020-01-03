import { createGlobalStyle } from "styled-components";

// Import fonts
// TODO: clean all this up!
import InterRegularWoffTwo from "./../static/fonts/inter/Inter-Regular.woff2";
import InterRegularWoff from "./../static/fonts/inter/Inter-Regular.woff";
import InterMediumWoffTwo from "./../static/fonts/inter/Inter-Medium.woff2";
import InterMediumWoff from "./../static/fonts/inter/Inter-Medium.woff";
import InterBoldWoffTwo from "./../static/fonts/inter/Inter-Bold.woff2";
import InterBoldWoff from "./../static/fonts/inter/Inter-Bold.woff";
import InterExtraBoldWoffTwo from "./../static/fonts/inter/Inter-ExtraBold.woff2";
import InterExtraBoldWoff from "./../static/fonts/inter/Inter-ExtraBold.woff";
import InterLightWoffTwo from "./../static/fonts/inter/Inter-Light-BETA.woff2";
import InterLightWoff from "./../static/fonts/inter/Inter-Light-BETA.woff";
import InterThinWoffTwo from "./../static/fonts/inter/Inter-Thin-BETA.woff2";
import InterThinWoff from "./../static/fonts/inter/Inter-Thin-BETA.woff";
import InterExtraLightWoffTwo from "./../static/fonts/inter/Inter-ExtraLight-BETA.woff2";
import InterExtraLightWoff from "./../static/fonts/inter/Inter-ExtraLight-BETA.woff";

const GlobalStyle = createGlobalStyle`

	// Setup font faces
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100;
    src:
      url('${InterThinWoffTwo}') format('woff2'),
      url('${InterThinWoff}') format('woff');
	}
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 200;
    src:
      url('${InterExtraLightWoffTwo}') format('woff2'),
      url('${InterExtraLightWoff}') format('woff');
	}
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 300;
    src:
      url('${InterLightWoffTwo}') format('woff2'),
      url('${InterLightWoff}') format('woff');
	}
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
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
    font-weight: 700;
    src:
      url('${InterBoldWoffTwo}') format('woff2'),
      url('${InterBoldWoff}') format('woff');
	}
	@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 800;
    src:
      url('${InterExtraBoldWoffTwo}') format('woff2'),
      url('${InterExtraBoldWoff}') format('woff');
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
  	color: inherit;
  	-webkit-font-smoothing: antialiased;
  	-moz-osx-font-smoothing: grayscale;
	}
	body {
		// Typography
		font: 15px/22px 'Inter', system-ui, sans-serif;
		letter-spacing: -0.004em;
		font-kerning: normal;
		font-variant-ligatures: contextual common-ligatures;
		font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;

		min-height: 100vh;
		// Project Defaults ^
		// Typography
		// Layout
		// Colors
		background: ${({ theme }) => theme.background};
		color: ${({ theme }) => theme.text.color};
	}

	span {
		display: inline-block;
	}
`;

export default GlobalStyle;
