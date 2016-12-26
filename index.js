var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var MongoStream = require('mongo-trigger');

var routes = require('./routes/index');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/', routes);

mongoose.connect('mongodb://localhost/test');
var connection = mongoose.createConnection('mongodb://localhost/test');
var db = mongoose.connection;
var Admin = mongoose.mongo.Admin;
var allDatabases;
var databases = [];

db.on('error', console.error.bind(console, 'connection error:'));
connection.on('open', function() {
    new Admin(connection.db).listDatabases(function(err, result) {
        console.log('listDatabases succeeded');
        allDatabases = result.databases;
        for (let i = 0; i < allDatabases.length; i++) {
            databases.push(allDatabases[i]['name']);
        }
        app.locals.databases  = databases
    });
});

var trace = []

var watcher = new MongoStream({format: 'pretty'});
watcher.watch('test.kittens', function(event) {
  // parse the results
  // console.log('something changed:', event);
  trace.push(event[2]['operation']);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

// var watcher = new MongoStream({format: 'pretty'});
//
// watcher.watch('test.users', function(event) {
//   console.log('something changed:', event);
// })
