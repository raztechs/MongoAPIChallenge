'use strict';

var mongoose = require('mongoose'),
	Transaction = mongoose.model('Transactions');

var nvlStripArray = function(array, idx, key) {
    if (array.length > 0) {
        if (typeof key !== 'undefined')
            return array[idx][key];
        else
            return array[idx];
    } else {
        return 0;
    };
};

var hasKey = function(json, key) {
	return typeof json[key] !== 'undefined';
};

var hasKeys = function(json, keys) {
	var len = keys.length;
	for (var i = 1; i < len; i++){
		if(!hasKey(json, keys[i]))
			return false;
	};
	return true;
};

exports.add_new_transaction = function(req, res) {
	var new_transaction = new Transaction(req.body);
	new_transaction.save(function(err, transaction) {
		if (err)
			res.send(err);
		res.json(transaction);
	});
};

exports.db_query_user = function(req, res) {
	if (hasKeys(req.query, ['user', 'day', 'threshold'])) {
		var user = parseInt(req.query.user),
			day = parseInt(req.query.day),
			threshold = parseInt(req.query.threshold);
		Transaction.find({ $or:[{'sender': user}, {'receiver': user}],
					timestamp: day,
					sum: {$gte: threshold}}, function(err, transaction) {
                        if (err)
                            res.send(err);
                        res.json(transaction);
                    });
	} else {
        res.json({message: "Wrong params"});
    };
};

exports.db_get_balance = function(req, res) {
    if (hasKeys(req.query, ['user', 'since', 'until'])) {
        var user = parseInt(req.query.user),
            since = parseInt(req.query.since),
            until = parseInt(req.query.until),
            plus = Transaction.aggregate(  {$match: {
                                        receiver: user,
                                        timestamp: {
                                            $gte: since,
                                            $lte: until
                                        }
                                    }},
                                    {$group: {
                                        _id: {'receiver': '$receiver'},
                                        total: {$sum: '$sum'}
                                    }}).exec(),
            minus = Transaction.aggregate(  {$match: {
                                        sender: user,
                                        timestamp: {
                                            $gte: since,
                                            $lte: until
                                        }
                                    }},
                                    {$group: {
                                        _id: {'sender': '$sender'},
                                        total: {$sum: '$sum'}
                                    }}).exec();
            plus.then(function(val1) {
                minus.then(function(val2) {
                    var got = nvlStripArray(val1, 0, 'total'),
                        spent = nvlStripArray(val2, 0, 'total');
                    res.json({total: got - spent});
                });
            });
    } else {
        res.json({message: "Wrong params"});
    };
};