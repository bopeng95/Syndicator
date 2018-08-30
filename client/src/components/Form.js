import React from 'react';
import Event from './Event.js';
import axios from 'axios';
import '../css/skeleton.css';
import '../css/normalize.css';
import '../css/main.css';
import cron from 'node-cron';

export default class ContactForm extends React.Component { 

	constructor() {
		super();
		this.state = {
			classnames: '',
			noEvent: 'There are no events.',
			events: [],
			alert: '',
			name: '',
			description: '',
			start: Date,
			end: Date,
			source: ''
		}
		this.handleName = this.handleName.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.postName = this.postName.bind(this);
	}

	task = () => cron.schedule('* * * * * *', () => {
		console.log('Reloading\n\nEvents showing means not added yet.\n\nEvents gone means added to other sites.');
		this.getEvents();
	});

	componentDidMount() {
		this.getEvents();
		this.task();
	}

	handleName = (e) => {this.setState({name: e.target.value})};
	handleDescription = (e) => {this.setState({description: e.target.value})};
	handleStart = (e) => {this.setState({start: e.target.value})};
	handleEnd = (e) => {this.setState({end: e.target.value})};
	handleSource = (e) => {this.setState({source: e.target.value})};

	getEvents = () => {
		axios.get('/api/events')
		.then(data => {
			let newData = data.data.filter(e => e.used === false);
			if(newData.length === 0) {
				this.setState({noEvent: 'There are no events.'})
			} else {
				this.setState({noEvent: ''})
			}
			this.setState({events: newData});
		});
	};

	postName = (e) => {
		e.preventDefault();
		console.log('Submit pressed.')
		let now = Date.now();
		let s = new Date(this.state.start);
		let en = new Date(this.state.end);
		if(now - s > 0) {
			this.setState({alert: 'Invalid Start Date (now or future)'});
		} else if(s - en > 0) {
			this.setState({alert: 'End Date is before Start Date!'})
		} else {
			let n = this.state.name; let des = this.state.description;
			let strt = this.state.start; let endDate = this.state.end;
			this.setState({name:'',description:'',alert:''});
			axios.post('/add', {name:n,description:des,start:strt,end:endDate,source:this.state.source})
			.then(this.getEvents());
		}
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="five columns">
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
							<label>Source</label>
							<input className="u-full-width" type="text" name="source" onChange={this.handleSource} required/>
							<input type="submit" value="Submit"/>
						</form>
						<p className="alert">{this.state.alert}</p>
					</div>
					<div className="seven columns">
						<h4 className="title">To Be Added</h4>
						<Event eve={this.state.events} condition={this.state.noEvent}/>
					</div>
				</div>
			</div>
		)
	}
}
