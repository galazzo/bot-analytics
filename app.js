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




/*var dbConfig = nconf.get('database');


var dbPort = dbConfig.port;
var dbHost = dbConfig.host;
var dbName = dbConfig.name;

var dbServerName = "spac3";

var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;

var db = new MongoDB(dbName, new Server(dbHost, dbPort, { auto_reconnect: true }), { w: 1 });
db.open(function (e, d) {
	if (e) {
		console.log(e);
	} else {
		console.log('connected to database :: ' + dbName);
	}
});
*/

/*
 * "mongodb://localhost:27017/assist"
 * "mongodb://<dbuser>:<dbpassword>@ds042379.mlab.com:42379/assist";
 */
function buildConnectionString(database) {
	return connection = "mongodb://" + ((typeof database.connection.user != 'undefined' && typeof database.connection.password != 'undefined' && database.connection.user != "" && database.connection.password != "") ? database.connection.user + ":" + database.connection.password + "@" : "") + database.connection.host + ":" + database.connection.port + "/" + database.name;
}
