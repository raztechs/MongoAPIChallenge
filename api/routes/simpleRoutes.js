'use strict';

module.exports = function(app){
	var mongoAPI = require('../controllers/simpleController');

	app.route(/transactions)
		.post(mongoAPI.add_new_transaction);
		.get(mongoAPI.database_query)
};