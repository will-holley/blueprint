import React from 'react';
import { Helmet } from 'react-helmet';

class Head extends React.Component {
	// https://github.com/nfl/react-helmet/issues/342
	get icons() {
		return (
			<React.Fragment>
				<link
					rel="apple-touch-icon"
					sizes="57x57"
					href="/images/favicon/apple-icon-57x57.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="60x60"
					href="/images/favicon/apple-icon-60x60.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="72x72"
					href="/images/favicon/apple-icon-72x72.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="76x76"
					href="/images/favicon/apple-icon-76x76.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="114x114"
					href="/images/favicon/apple-icon-114x114.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="120x120"
					href="/images/favicon/apple-icon-120x120.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="144x144"
					href="/images/favicon/apple-icon-144x144.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="/images/favicon/apple-icon-152x152.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/images/favicon/apple-icon-180x180.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="192x192"
					href="/images/favicon/android-icon-192x192.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/images/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="96x96"
					href="/images/favicon/favicon-96x96.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/images/favicon/favicon-16x16.png"
				/>
				<meta
					name="msapplication-TileImage"
					content="/images/favicon/ms-icon-144x144.png"
				/>
				<link rel="manifest" href="/images/favicon/manifest.json" />
				<meta name="msapplication-TileColor" content="#ffffff" />
				<meta name="theme-color" content="#ffffff" />
			</React.Fragment>
		);
	}

	get title() {
		return 'Startnet';
	}

	get description() {
		return 'Scaffolding for dreams';
	}

	render() {
		return (
			<Helmet>
				<meta charset="utf-8" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta
					id="viewport"
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>{this.title}</title>
				<meta name="description" content={this.description} />
				<link rel="canonical" href="index.html" />
				{/*{this.icons}*/}
			</Helmet>
		);
	}
}

export default Head;
