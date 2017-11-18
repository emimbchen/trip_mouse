var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require('path');
var tripObject = require('../models/schemas.js');

//route to post new trips
router.post('/', function (req, res) {
    console.log('in router Post!');
    console.log(req.body);
    var tripToAdd = new tripObject(req.body);
    tripToAdd.save(function (err, data) {
        if (err) {
            console.log("Error in the trip post", err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});



module.exports = router;
