// Get needed dependencies.
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var db = require('monk')('localhost:27017/emails');
var app = express();

// bodyParser() gets the data from a POST.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
    req.db = db;
    next();
});

// Get an instance of the Express Router.
var router = express.Router();

// Get the email submission form.
router.get('/collect', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'collection.html'));
});

// Get the thank you page.
router.get('/thankyou', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'thankyou.html'));
});

router.post('/addMail', function(req, res) {
    var username = req.body.name;
    var useremail = req.body.email;
   
    db.get('usercollection').insert({
      "name" : username,
      "email": useremail
    }, function (err, doc) {
      if (err) {
         res.send("Error adding user to db.");
      }
      else {
        res.location('thankyou');
        res.redirect('thankyou');
      }
    }); 
});

// Tell express to use the route you just set up.
app.use(router);



app.listen(3000);
console.log("listening on port 3000");


//module.exports = app;
