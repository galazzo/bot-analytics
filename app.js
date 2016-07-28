var express = require('express');
var app = express();
var http = require('http');
var errorHandler = require('errorhandler');
var moment = require('moment');

app.set('port', process.env.PORT || 1337);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

var config = require('./config.json');
//console.log(config);

var MongoClient = require('mongodb').MongoClient;

var connection = buildConnectionString(config.database);
console.log(connection);

// Connect to the db
MongoClient.connect(connection, function (err, db) {
	if (!err) {
		console.log("We are connected");
		
		http.createServer(app).listen(app.get('port'), function () {
			console.log("Express server listening on port " + app.get('port'));
		})
		
		db.collections(function (err, collections) {
			console.log(collections);
		});

		/*db.createCollection("test", function (err, collection) {
			collection.insert({ "test": "value" });
		});*/
	}
});


app.get("/", function (req, res) {
	res.status(200);
	res.write("Bot Analytics Platform");
	res.end();
}); 

/*
 * "mongodb://localhost:27017/assist"
 * "mongodb://<dbuser>:<dbpassword>@ds042379.mlab.com:42379/assist";
 */
function buildConnectionString(database) {
	return connection = "mongodb://" + ((typeof database.connection.user != 'undefined' && typeof database.connection.password != 'undefined' && database.connection.user != "" && database.connection.password != "") ? database.connection.user + ":" + database.connection.password + "@" : "") + database.connection.host + ":" + database.connection.port + "/" + database.name;
}
