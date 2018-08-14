import React, { Component } from 'react';
import EventForm from './components/Form.js'

class Home extends Component {

	constructor() {
		super();
		this.state = {
			classnames: ''
		}
	}

	render() {
		return (
			<div className={this.state.classnames}>
				<EventForm/>
			</div>
		);
	}
}

export default Home;
