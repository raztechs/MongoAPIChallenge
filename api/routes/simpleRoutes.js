'use strict';

module.exports = function(app){
	var mongoAPI = require('../controllers/simpleController');

	app.route('/transactions/')
		.post(mongoAPI.add_new_transaction)
		.get(mongoAPI.db_query_user);

	app.route('/balance/')
		.get(mongoAPI.db_get_balance);
};