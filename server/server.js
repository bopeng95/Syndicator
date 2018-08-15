require('./db');
const tokens = require('./config.json');
const express = require('express');
const app = express();
const cron = require('node-cron');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const axios = require('axios');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const port = 5000;

/*TOKENS
==================================================*/
/*Eventbrite*/
const eventbriteToken = tokens.eventbrite;
const urls = 'https://www.eventbriteapi.com/v3/users/me/owned_events/?token=' + eventbriteToken;
const postUrl = 'https://www.eventbriteapi.com/v3/events/';

/*Picatic*/
const picaticKey = tokens.picatic['private_key'];
const picaticEvent = 'https://api.picatic.com/v2/event';

/*Xing Events*/
const xingKey = tokens.xing['key'];
//used to get your xing accounts id
const xingGetId = 'https://www.xing-events.com/api/user/find?apikey='+xingKey+'&version=1&format=json&username='+tokens.xing['email'];
const xingEvent = 'https://www.xing-events.com/api/event/create?apikey='+xingKey+'&version=1&format=json&hostId='+tokens.xing['id'];

/*EventZilla (not working) */ 
const eventzillaToken = tokens.eventzilla['token'];
const ezKey = tokens.eventzilla['zapier-key'];
const ezUrl = 'https://www.eventzillaapi.net/api/v1/events/';
/*================================================*/

/*HEADERS
==================================================*/
const _headers = {
	'eventbrite': {
		'Authorization': 'Bearer ' + eventbriteToken,
		'Content-Type': 'application/json'
	},
	'picatic': {
		'Authorization': 'Bearer ' + picaticKey,
		'Content-Type': 'application/json'
	},
	'eventzilla': {
		'Authorization': 'Bearer ' + eventzillaToken,
		'Content-Type': 'application/json'
	}
}
/*================================================*/

//CRON set to 1 minute for now
let cronPost = () => cron.schedule('* * * * *', function() {
	Event.find({'used': false}, (err, result, count) => {
		Event.updateMany({'used': false}, { $set: { 'used': true } },(err,doc) => {
			if(err) console.log(err);
			else {
				if(result.length == 0) { console.log('Nothing has been added.'); }
				else {
					console.log('Changed used to true for added events.');
					result.map(e => {
						const eb_event = { //adding to eventbrite 
							"event.name.html": e.name,
							"event.description.html": e.description,
							"event.start.timezone": "America/New_York",
							"event.start.utc": e.start.toISOString().substring(0,19) + 'Z',
							"event.end.timezone": "America/New_York",
							"event.end.utc": e.end.toISOString().substring(0,19) + 'Z',
							"event.currency": "USD"
						};
						const picatic_event = { //adding to picatic
							"data": {
								"attributes": {
									"title": e.name,
									"description": e.description,
									"type": "free",
									"time_zone":"America/New_York",
									"start_date":e.start.toISOString().substring(0,10),
									"start_time":e.start.toISOString().substring(11,19),
									"end_date":e.end.toISOString().substring(0,10),
									"end_time":e.end.toISOString().substring(11,19)
								},
								"type": "event"
							}
						}
						axios({
							method: 'post',
							url: postUrl,
							headers: _headers['eventbrite'],
							data: eb_event
						}).then().catch(err => console.log(err.response.data));
						axios({
							method: 'post',
							url: picaticEvent,
							headers: _headers['picatic'],
							data: picatic_event
						}).then().catch(err => console.log(err.response.data));
						let xingUrl = xingEvent+'&title='+e.name+'&country=US'; //adding to xing events 
						xingUrl += '&selectedDate='+e.start.toISOString().substring(0,19);
						xingUrl += '&selectedEndDate='+e.end.toISOString().substring(0,19);
						xingUrl += '&description='+e.description+'&timezone=America/New_York';
						axios.post(xingUrl).then().catch(err => console.log(err.reponse.data));
					});
				}
			}
		});
	})
});
cronPost();

app.get('/api/events', (req, res) => {
	Event.find((err, result, count) => {
		res.json(result.map(function(e) {
			let obj = {
				id: e._id,
				name: e.name,
				description: e.description,
				start: e.start,
				end: e.end,
				used: e.used
			}; return obj;
		}));
	})
});

app.post('/add', (req, res) => {
	let n = req.body.name;
	let d = req.body.description;
	let s = req.body.start;
	let e = req.body.end;
	console.log('Added:\nTitle: '+n+'\nDescription: '+d+'\nStart: '+s+'\nEnd: '+e+'\n');
	const event = new Event({
		name: n,  
		description: d,
		start: s,
		end: e,
		used: false
	});
	event.save((err, result, count) => {
		if(err) { res.send(err); }
		else { res.send(result); }
	});
});

app.listen(port, () => console.log('Server on port ' + port));


/*if(axiosPosts.length > 0) {
	axios.all(axiosPosts)
	.then(axios.spread((...responses) => {
		responses.forEach(res => console.log('Finished'))
		console.log('All axios posts completed');
	})).catch(error => console.log(error.response.data));
}*/