const mongoose = require('mongoose');

const event = mongoose.Schema({
	name: String,
	description: String,
	start: Date,
	end: Date,
	used: Boolean
});

mongoose.model('Event', event);

mongoose.connect('mongodb://localhost/pulsd');