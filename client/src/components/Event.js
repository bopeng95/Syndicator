import React from 'react';

export default class Event extends React.Component { 

	constructor() {
		super();
		this.state = {
			classnames: 'added-events',
		}
	}

	render() {
		return (
			<div>
				{this.props.eve.map(p => 
					<div key={p.id} className={this.state.classnames}>
						<p className="event-name"><b>{p.name}</b></p>
						<p className="event-des">{p.description}</p>
						<div className="row">
							<div className="six columns">
								<p className="event-title">Start</p>
								<time>{p.start}</time>
							</div>
							<div className="six columns">
								<p className="event-title">End</p>
								<time>{p.end}</time>
							</div>
						</div>
					</div>
				)}
				<p>{this.props.condition}</p>
			</div>
		)
	}
}