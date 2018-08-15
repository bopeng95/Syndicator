import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { 
	BrowserRouter as Router,
	Switch,
	Route,
	Link 
} from 'react-router-dom';
import './css/main.css';
import Home from './Home.js';
import registerServiceWorker from './registerServiceWorker';

class NavLink extends React.Component {
    render() {
        var isActive = this.context.router.route.location.pathname === this.props.to;
        var className = isActive ? 'link active' : 'link';

        return(
            <Link className={className} {...this.props}>
                {this.props.children}
            </Link>
        );
    }
}

NavLink.contextTypes = {
    router: PropTypes.object
};

const Header = () => (
	<header>
		<nav>
			<ul>
				<li><NavLink to="/">Dashboard</NavLink></li>
			</ul>
		</nav>
	</header>
)

const Main = () => (
	<main>
		<Switch>
			<Route exact path='/' component={Home}/>
		</Switch>
	</main>
)

const App = () => (
	<div className="my-container">
		<Header/>
		<Main/>
	</div>
)

ReactDOM.render(
	(<Router>
		<App/>
	</Router>
	),document.getElementById('root')
);
registerServiceWorker();
