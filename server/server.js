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

let cronPost = () => cron.schedule('*/15 * * * * *', function() {
	Event.find({'used': false}, (err, result, count) => {
		Event.updateMany({'used': false}, { $set: { 'used': true } },(err,doc) => {
			if(err) console.log(err);
			else {
				if(result.length > 0) { console.log('Changed used to true for added events.'); }
				else { console.log('Nothing has been added.') }
				let axiosPosts = [];
				result.map(e => {
					const _event2 = {
						"event.name.html": e.name,
						"event.description.html": e.description,
						"event.start.timezone": "America/Chicago",
						"event.start.utc": e.start.toISOString().substring(0,19) + 'Z',
						"event.end.timezone": "America/Chicago",
						"event.end.utc": e.end.toISOString().substring(0,19) + 'Z',
						"event.currency": "USD"
					};
					let promises = axios({
						method: 'post',
						url: postUrl,
						headers: _headers,
						data: _event2
					}).then().catch(err => console.log(err.response.data.error_description));
					axiosPosts.push(promises);
				});
				if(axiosPosts.length > 0) {
					axios.all(axiosPosts)
					.then(axios.spread((...responses) => {
						responses.forEach(res => console.log('Finished'))
						console.log('All axios posts completed');
					})).catch(error => console.log('ERROR'));
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