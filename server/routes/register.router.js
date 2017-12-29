var express = require('express');
var router = express.Router();
var Users = require('../models/user.js');
var path = require('path');


// Handles request for HTML file
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
});

// Handles POST request with new user data
router.post('/', function(req, res, next) {
  /*
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  recipes: {type: Array}
  */
    var userToSave = {
      username : req.body.username,
      password : req.body.password
    };


    Users.create(userToSave, function(err, post) {
        if(err) {
          console.log('post /register -- User.create -- failure', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
    });
});


module.exports = router;
