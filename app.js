// Get needed dependencies.
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var db = require('monk')('localhost:27017/emails');
var app = express();

var config = require('./config');

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
        sendEmail(useremail);
        res.location('thankyou');
        res.redirect('thankyou');
      }
    }); 
});

// Tell express to use the route you just set up.
app.use(router);

app.listen(config.port);
console.log("listening on port:", config.port);


var http = require('http');
var apiToken = config.apiToken;
function sendEmail (toEmail) {
    
    var emailbody = {
       'From': config.fromEmail,
       'To': toEmail, 
       'Subject': 'Postmark test', 
       'HtmlBody': '<html><body><strong>Hello</strong> dear Postmark user.</body></html>'
    };

    var options = {
        host: 'api.postmarkapp.com',
        path: '/email',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': apiToken
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('body: ' + chunk);
        });
    });

    req.write(JSON.stringify(emailbody));
    req.end();
}
