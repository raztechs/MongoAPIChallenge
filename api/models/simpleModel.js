'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
	sender: {
		type: Number,
		Required: 'Must have a sender_id'
	},
	receiver: {
		type: Number,
		Required: 'Must have a receiver_id'
	},
	timestamp: {
		type: Number,
		default: 0
	},
	sum: {
		type: Number,
		Required: 'Amount must be specified'
	}
});

module.exports = mongoose.model('Transactions', TransactionSchema);
