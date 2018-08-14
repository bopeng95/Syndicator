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

/*================================================*/
// const _event = {
// 	"event.name.html": "TestEvent01",
// 	"event.description.html": "TestEvent01",
// 	"event.start.timezone": "America/Chicago",
// 	"event.start.utc": "2018-10-10T18:00:00Z",
// 	"event.end.timezone": "America/Chicago",
// 	"event.end.utc": "2018-10-10T20:00:00Z",
// 	"event.currency": "USD",
// };
// const _headers = {
// 	'Authorization': 'Bearer ' + eventbriteToken,
// 	'Content-Type': 'application/json'
// }

Event.find((err, eve, count) => {
	const _event2 = {
		"event.name.html": eve[0].name,
		"event.description.html": eve[0].description,
		"event.start.timezone": "America/Chicago",
		"event.start.utc": eve[0].start,
		"event.end.timezone": "America/Chicago",
		"event.end.utc": eve[0].end,
		"event.currency": "USD"
	};
	const _headers2 = {
		'Authorization': 'Bearer ' + eventbriteToken,
		'Content-Type': 'application/json'
	}
});

// axios({
// 	method: 'POST',
// 	url: postUrl,
// 	headers: _headers,
// 	data: _event
// })
// .then(function(response) {
// 	console.log('added event: ' + response.data.name.text);
// });

app.get('/api/events', (req, res) => {
	Event.find((err, result, count) => {
		res.json(result.map(function(e) {
			let obj = {
				id: e._id,
				name: e.name,
				description: e.description,
				start: e.start,
				end: e.end
			}; return obj;
		}));
	})
});

app.post('/add', (req, res) => {
	let n = req.body.name;
	let d = req.body.description;
	let s = req.body.start;
	let e = req.body.end;
	console.log(n,d,s,e);
	const event = new Event({
		name: n,  
		description: d,
		start: s,
		end: e
	});
	event.save((err, result, count) => {
		if(err) { res.send(err); }
		else { res.send(result); }
	});
});

app.listen(port, () => console.log('Server on port ' + port));