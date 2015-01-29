// Get needed dependencies.
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/emails');
var app = express();

// bodyParser() gets the data from a POST.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'public')));

//app.use(function(req,res,next) {
//    req.db = db;
//    next();
//});

// Get an instance of the Express Router.
var router = express.Router();

// Get the email submission form.
router.get('/getMeEmails', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'super.html'));
});

// Tell express to use the route you just set up.
app.use(router);



app.listen(3000);
console.log("listening on port 3000");


//module.exports = app;
