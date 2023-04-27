import React, { useContext, useEffect } from 'react';
import {
	Switch,
	Route,
	useLocation,
	BrowserRouter as Router
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './css/style.css';
import 'flatpickr/dist/flatpickr.css';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Home from './pages/Home';
import ContratHome from './pages/Contrat/ContratHome';
import ContratNew from './pages/Contrat/ContratNew';
import PageNotFound from './pages/utility/PageNotFound';
import ReactDOM from 'react-dom/client';
import Signin from './pages/Signin';
import ContratConsulter from './pages/Contrat/ContratConsulter';
import { ApiContext, ApiProvider } from './providers/ApiContext';
import { AuthContext, AuthProvider } from './providers/AuthContext';
import NotificationsCalendar from './pages/NotificationsCalendar';
import BaseDocumentaire from './pages/BaseDocumentaire';

function App() {

	// overflow hidden on body
	useEffect(() => {
		document.body.classList.add('overflow-hidden');
	});
	const location = useLocation();

	useEffect(() => {
		document.querySelector('html').style.scrollBehavior = 'auto';
		window.scroll({ top: 0 });
		document.querySelector('html').style.scrollBehavior = '';
	}, [location.pathname]); // triggered on route change

	return (
		<>
			<Switch>
				{/*{isConnected ? (
					<>
						<Route exact path="/" component={Home} />
						<Route
							exact
							path="/notifications"
							component={NotificationsCalendar}
						/>
						<Route exact path="/contrat" component={ContratHome} />
						<Route path="/contrat/new" component={ContratNew} />
						<Route
							exact
							strict
							path="/contrat/consult/:id"
							component={ContratConsulter}
						/>
						{user.is_juridique && (
							<Route
								exact
								path="/base_documentaire"
								component={BaseDocumentaire}
							/>
						)}
						<Route path="*" component={PageNotFound} />
					</>
				) : (
					<>
						<Route path="/connexion">
							<Signin />
						</Route>
						<Route path="*" component={Signin} />
					</>
				)}*/}

				<Route exact path="/" component={Home} />
			</Switch>
		</>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
				<Router>
					<App />
					<ToastContainer
						position="top-center"
						autoClose={2000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						pauseOnFocusLoss
						theme="light"
						draggable={false}
					/>
				</Router>
	</React.StrictMode>
);
