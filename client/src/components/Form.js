import React from 'react';
import People from './People.js';
import axios from 'axios';
import '../css/skeleton.css';
import '../css/normalize.css';
import cron from 'node-cron';

export default class ContactForm extends React.Component { 

	constructor() {
		super();
		this.state = {
			classnames: '',
			events: [],
			name: '',
			description: '',
			start: Date,
			end: Date
		}
		this.handleName = this.handleName.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.postName = this.postName.bind(this);
	}

	// task = () => cron.schedule('*/5 * * * * *', function() {
	// 	console.log('ReLoading!!!');
	// 	this.getEvents();
	// });

	componentDidMount() {
		//this.task();
		this.getEvents();
	}

	handleName = (e) => {this.setState({name: e.target.value})};
	handleDescription = (e) => {this.setState({description: e.target.value})};
	handleStart = (e) => {this.setState({start: e.target.value})};
	handleEnd = (e) => {this.setState({end: e.target.value})};

	getEvents = () => {
		axios.get('/api/events')
		.then(data => this.setState({events: data.data}));
	};

	postName = (e) => {
		e.preventDefault();
		let n = this.state.name; let des = this.state.description;
		let strt = this.state.start; let endDate = this.state.end;
		this.setState({name:'',description:''});
		axios.post('/add', {name:n,description:des,start:strt,end:endDate})
		.then(this.getEvents());
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="four columns">
						<h4 className="title">Add Events</h4>
						<form className={this.state.classnames} onSubmit={this.postName}>
							<label>Name</label>
							<input className="u-full-width" type="text" name="name" value={this.state.name} onChange={this.handleName} required/>
							<label>Description</label>
							<textarea className="u-full-width" type="text" name="description" value={this.state.description} onChange={this.handleDescription} required/>
							<label>Start</label>
							<input className="u-full-width" type="datetime-local" name="start" onChange={this.handleStart} required/>
							<label>End</label>
							<input className="u-full-width" type="datetime-local" name="end" onChange={this.handleEnd} required/>
							<input type="submit" value="Submit"/>
						</form>
					</div>
					<div className="eight columns">
						<h4 className="title">Added Events</h4>
						<People eve={this.state.events}/>
					</div>
				</div>
			</div>
		)
	}
}
