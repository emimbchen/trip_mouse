var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require('path');
var tripObject = require('../models/schemas.js');

//route to post new trips
router.post('/', function (req, res) {
    var tripToAdd = new tripObject(req.body);
    tripToAdd.userId = req.user._id;
    tripToAdd.save(function (err, data) {
        if (err) {
            console.log("Error in the trip post", err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

//route to get all trips
router.get('/', function (req, res) {
    tripObject.find({userId: req.user._id}).sort({returnDate: 'desc'}).exec(function (err, foundObjects) {
        if (err) {
            console.log('error', err);
            res.sendStatus(500);
        } else {
            res.send(foundObjects);
        }
    });
})


//route to get selected trip
router.get('/:id', function (req, res) {
    var tripId = req.params.id;
    console.log(tripId);
    tripObject.findById({ _id: tripId }).exec(function (err, foundObjects) {
        if (err) {
            console.log('error', err);
            res.sendStatus(500);
        } else {
            res.send(foundObjects);
        }
    });
})

//route to find and update trip with edited info
router.put('/:id', function(req, res){
    var sentUpdate = req.body;
    var id = req.params.id;
    console.log(sentUpdate);
    console.log(id);
    tripObject.findOne({_id: id}, function (err, user){
    
    // tripObject.save(function(err,results){
    //     if(err) console.log(err);
    //     console.log(results)
    })
});

//route to delete an entire tirp
router.delete('/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    tripObject.findByIdAndRemove({_id: id}, function(err, user){
        if (err){
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send(201);
        }
    });
});







module.exports = router;
