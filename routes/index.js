var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var collections = []

router.get('/', function (req, res) {
    res.render('select_db', {
        title: 'Subscription',
        databases: req.app.locals.databases
    });
});

router.post('/', function (req, res) {
    // mongoose.connect('mongodb://localhost/' + req.body.database)
    // var db = mongoose.connection;
    var connection = mongoose.createConnection('mongodb://localhost/' + req.body.database)
    connection.on('open', function () {
        connection.db.listCollections().toArray(function(err, names) {
            if (err) {
                console.log(err);
            } else {
                collections = []
                names.forEach(function(e, i, a) {
                    collections.push(e.name);
                });
            }
        });
    });
    res.redirect('/collections');
});

router.get('/collections', function(req, res) {
    res.render('select_collection', {
        tite: 'Subscription',
        collections: collections
    });
});

router.post('/collections', function (req, res) {
    console.log(req.body.collection)
    res.redirect('/collections')
})
module.exports = router
