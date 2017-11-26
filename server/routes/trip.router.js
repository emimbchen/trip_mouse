var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require('path');
var Trip = require('../models/schemas.js');

//route to post new trips
router.post('/', function (req, res) {
    var tripToAdd = new Trip(req.body);
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

//route to get all trips for the user page
router.get('/', function (req, res) {
    Trip.find({userId: req.user._id}).sort({returnDate: 'desc'}).exec(function (err, foundObjects) {
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
    Trip.findById({ _id: tripId }).exec(function (err, foundObjects) {
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
    var id = req.params.id;
    Trip.findOne({_id: id}, function(err, trip){
        trip.tripDestination = req.body.tripDestination;
        trip.leaveDate = req.body.leaveDate;
        trip.returnDate = req.body.returnDate;
        trip.travellers = req.body.travellers;
        console.log(trip);
        trip.save(function(err){
            if(err){
            console.log(err);
            res.sendStatus(500);
            } else{
                res.sendStatus(201);
            }
        });
    });
});

//put route to accept new transportation details
router.put('/transportation/:id', function(req, res){
    var id= req.params.id;
    var transportationOb = req.body;
    Trip.findOne({_id : id}, function(err, trip){
        trip.transportation.push(transportationOb);
        trip.save(function(err){
            if(err){
                console.log(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
    });
});

//put route for new lodging
router.put('/lodging/:id', function (req, res) {
    var id = req.params.id;
    var lodgingOb = req.body;
    Trip.findOne({ _id: id }, function (err, trip) {
        trip.lodging.push(lodgingOb);
        trip.save(function (err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
    });
});

//put for new activities
router.put('/activities/:id', function (req, res) {
    var id = req.params.id;
    var activityOb = req.body;
    Trip.findOne({ _id: id }, function (err, trip) {
        trip.activities.push(activityOb);
        trip.save(function (err) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
    });
});


//route to delete an entire trip
router.delete('/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    Trip.findByIdAndRemove({_id: id}, function(err, trip){
        if (err){
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send(201);
        }
    });
});







module.exports = router ;
