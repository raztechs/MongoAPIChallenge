var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000,
    mongoose = require('mongoose'),
    Transaction = require('./api/models/simpleModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo/Challengedb');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/simpleRoutes');
routes(app);

app.listen(port);

console.log('ChallengeAPI server started on port' + port);
