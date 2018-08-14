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

/*EventZilla*/
const eventzillaToken = tokens.eventzilla;
const ezUrl = 'https://www.eventzillaapi.net/api/v1/events/x-api-key: ' + eventzillaToken;

/*================================================*/

const _headers = {
	'Authorization': 'Bearer ' + eventbriteToken,
	'Content-Type': 'application/json'
}

const _event = {
	"event.name.html": "TestEvent01",
	"event.description.html": "TestEvent01",
	"event.start.timezone": "America/Chicago",
	"event.start.utc": "2018-10-10T18:00:00Z",
	"event.end.timezone": "America/Chicago",
	"event.end.utc": "2018-10-10T20:00:00Z",
	"event.currency": "USD",
};

// axios({
// 	method: 'POST',
// 	url: postUrl,
// 	headers: _headers,
// 	data: _event
// })
// .then(function(response) {
// 	console.log('added event: ' + response.data.name.text);
// });

// Event.find((err, eve, count) => {
// 	if(eve != undefined) {
// 		eve.map(e => {
// 			const _event2 = {
// 				"event.name.html": e.name,
// 				"event.description.html": e.description,
// 				"event.start.timezone": "America/Chicago",
// 				"event.start.utc": e.start,
// 				"event.end.timezone": "America/Chicago",
// 				"event.end.utc": e.end,
// 				"event.currency": "USD"
// 			};
// 			let promise = axios({
// 				method: 'post',
// 				url: postUrl,
// 				headers: _headers,
// 				data: _event2
// 			});
// 			eventsToAdd.push(_event2);
// 		}); console.log(eventsToAdd);
// 		// axios.all(eventsToAdd)
// 		// .then(axios.spread((...responses) => {
// 		// 	responses.forEach(res => console.log('Success'))
// 		// 	console.log('submitted all axios calls');
// 		// })).catch(error => console.log('ERROR'));
// 	}
// });

// axios.get('http://localhost:5000/api/events').then(response => {
// 	//console.log(response.data);
// 	response.data.map(e => {
// 		const _event2 = {
// 			"event.name.html": e.name,
// 			"event.description.html": e.description,
// 			"event.start.timezone": "America/Chicago",
// 			"event.start.utc": e.start,
// 			"event.end.timezone": "America/Chicago",
// 			"event.end.utc": e.end,
// 			"event.currency": "USD"
// 		};
// 		api.create_event(_event2, (err, data) => {
// 			if(err) console.log(err.message);
// 			else console.log('Success!!');
// 		});
// 	});
// });

let cronPost = () => cron.schedule('*/10 * * * * *', function() {
	Event.find({'used': false}, (err, result, count) => {
		console.log(result);
		Event.updateMany({'used': false}, { $set: { 'used': true } },(err,doc) => {
			if(err) console.log(err);
			else {
				console.log('sucessssss');
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
	console.log(n,d,s,e);
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