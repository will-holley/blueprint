import Dashboard from '../views/Dashboard';
import Editor from '../views/Editor/Editor';

const routes = {
	'/': {
		exact: true,
		component: Dashboard,
		authenticated: false,
		label: 'Dashboard',
		nav: true
	},
	'/editor': {
		exact: true,
		component: Editor,
		authenticated: false,
		label: 'Editor',
		nav: true
	}
};

export default routes;
