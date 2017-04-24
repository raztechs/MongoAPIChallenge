'use strict';

var mongoose = require('mongoose'),
	Transaction = mongoose.model('Transactions');

var nvl = function(check, value) {
    if(typeof check === 'undefined')
        return value;
    else
        return check;
};

var hasKey = function(json, key) {
	return typeof json[key] !== 'undefined';
};

var hasKeys = function(json, keys) {
	for (var i = 1, len = keys.length; i < len; i++){
		if(!hasKey(json, keys[i]))
			return false;
	};
	
    return true;
};

// Function used to resolve POST request to /transactions/
exports.add_new_transaction = function(req, res) {
    if(hasKeys(req.body, ['sender', 'receiver', 'timestamp', 'sum'])) {
        var new_transaction = new Transaction(req.body);
        new_transaction.save(function(err, transaction) {
            if (err)
                res.send(err);
            res.json({status: 'success'});
        });
    } else {
        res.json({status: 'undefined'});
    };
};

// Function used to resolve GET request to /transactions/
exports.db_query_user = function(req, res) {
	if (hasKeys(req.query, ['user', 'day', 'threshold'])) {
		var user = parseInt(req.query.user),
			day = parseInt(req.query.day),
			threshold = parseInt(req.query.threshold);
		Transaction.find({ $or:[{'sender': user}, {'receiver': user}],
					       timestamp: day,
					       sum: {$gte: threshold}
                        })
                        .select('sender receiver timestamp sum -_id')
                        .exec(function(err, transaction) {
                            if (err)
                                res.send(err);
                            res.json(transaction);
                        });
	} else {
        res.json({status: 'undefined'});
    };
};

// Function used to resolve GET request to /balance/
exports.db_get_balance = function(req, res) {
    if (hasKeys(req.query, ['user', 'since', 'until'])) {
        var user = parseInt(req.query.user),
            since = parseInt(req.query.since),
            until = parseInt(req.query.until),
            plus = Transaction.aggregate(  
                {$match: {
                    receiver: user,
                    timestamp:  {
                            $gte: since,
                            $lte: until
                        }
                }},
                {$group: {
                    _id: {'receiver': '$receiver'},
                    total: {$sum: '$sum'}
                }},
                {$project: {
                    _id: 0,
                    receiver: '$_id.receiver',
                    total: '$total'     
                }})
                .exec(),
            minus = Transaction.aggregate(
                {$match: {
                    sender: user,
                    timestamp: {
                            $gte: since,
                            $lte: until
                        }
                }},
                {$group: {
                    _id: {'sender': '$sender'},
                    total: {$sum: '$sum'}
                }},
                {$project: {
                    _id: 0,
                    total: '$total'     
                }})
                .exec();
            plus.then(function(val1) {
                minus.then(function(val2) {
                    var got = nvl(val1[0]['total']),
                        spent = nvl(val2[0]['total']);
                    res.json({balance: got - spent});
                });
            });
    } else {
        res.json({status: 'undefined'});
    };
};