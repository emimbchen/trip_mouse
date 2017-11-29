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

// put route for all transportation  edits, adds, confirms, unconfirms and deletes
router.put('/transportation/:id', function(req, res){
    var id= req.params.id;
    var transportationOb = req.body;
    transportationOb.kind= 'transportation';
    console.log(transportationOb);
    switch (transportationOb.action) {
        case 'edit':
            Trip.findOneAndUpdate({ "_id": id, "transportation._id": transportationOb.detailId },
            {
                "$set": {
                    "transportation.$.type" : {type: transportationOb.type.type, icon: transportationOb.type.icon},
                    "transportation.$.from" : transportationOb.from,
                    "transportation.$.to" : transportationOb.to,
                    "transportation.$.date" : transportationOb.date,
                    "transportation.$.leaveTime" : transportationOb.leaveTime,
                    "transportation.$.arriveTime" : transportationOb.arriveTime,
                    "transportation.$.price" : transportationOb.price,
                    "transportation.$.details" : transportationOb.details,
                }
            }, function( err, trip){
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    } else {
                    res.sendStatus(201);
                }
            });
            break;
        case 'add':
            Trip.findOne({ _id: id }, function (err, trip) {
                trip.transportation.push(transportationOb);
                trip.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            });
            break;
        case 'confirm':
            Trip.findOneAndUpdate({ "_id": id, "transportation._id": transportationOb.detailId },
                {
                    "$set": {
                        "transportation.$.confirmed": transportationOb.confirmed,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'unconfirm':
            Trip.findOneAndUpdate({ "_id": id, "transportation._id": transportationOb.detailId },
                {
                    "$set": {
                        "transportation.$.confirmed": transportationOb.confirmed,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'delete':
        Trip.update({ "_id": id},
            { "$pull": { transportation: { _id: transportationOb.detailId }}},
            { "$pull": { itinerary: { _id: transportationOb.detailId } } },
            function (err, trip) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            }
        );
    }
});

//put route for all lodging edits, adds, confirms, unconfirms and deletes
router.put('/lodging/:id', function (req, res) {
    var id = req.params.id;
    var lodgingOb = req.body;
    lodgingOb.kind = 'lodging'; 
    console.log(lodgingOb);
    switch (lodgingOb.action) {
        case 'edit':
            Trip.findOneAndUpdate({ "_id": id, "lodging._id": lodgingOb.detailId },
                {
                    "$set": {
                        "lodging.$.name": lodgingOb.name,
                        "lodging.$.checkIn": lodgingOb.checkIn,
                        "lodging.$.checkOut": lodgingOb.checkOut,
                        "lodging.$.address": lodgingOb.address,
                        "lodging.$.phoneNumber": lodgingOb.phoneNumber,
                        "lodging.$.website": lodgingOb.website,
                        "lodging.$.price":  lodgingOb.price,
                        "lodging.$.details": lodgingOb.details,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'add':
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
            break;
        case 'confirm':
            Trip.findOneAndUpdate({ "_id": id, "lodging._id": lodgingOb.detailId },
                {
                    "$set": {
                        "lodging.$.confirmed": lodgingOb.confirmed,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'unconfirm':
            Trip.findOneAndUpdate({ "_id": id, "lodging._id": lodgingOb.detailId },
                {
                    "$set": {
                        "lodging.$.confirmed": lodgingOb.confirmed,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'delete':
            Trip.update({ "_id": id },
                { "$pull": { lodging: { _id: lodgingOb.detailId } } },
                { "$pull": { itinerary: { _id: lodgingOb.detailId } } },
                function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                }
            );
    }
});

//put for all activities edits, adds, confirms, unconfirms and deletes
router.put('/activities/:id', function (req, res) {
    var id = req.params.id;
    var activityOb = req.body;
    activityOb.kind = 'activity';
    console.log(activityOb);
    switch (activityOb.action) {
        case 'edit':
            Trip.findOneAndUpdate({ "_id": id, "activities._id": activityOb.detailId },
                {
                    "$set": {
                        "activities.$.activity": activityOb.activity ,
                        "activities.$.where": activityOb.where,
                        "activities.$.when": activityOb.when,
                        "activities.$.website": activityOb.website,
                        "activities.$.price": activityOb.price,
                        "activities.$.details": activityOb.details,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'add':
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
            break;
        case 'confirm':
            Trip.findOneAndUpdate({ "_id": id, "activities._id": activityOb.detailId },
                {
                    "$set": {
                        "activities.$.confirmed": activityOb.confirmed,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'unconfirm':
            Trip.findOneAndUpdate({ "_id": id, "activities._id": activityOb.detailId },
                {
                    "$set": {
                        "activities.$.confirmed": activityOb.confirmed,
                    }
                }, function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            break;
        case 'delete':
            Trip.update({ "_id": id },
                { "$pull": { activities: { _id: activityOb.detailId } } },
                {"$pull": {itinerary: {_id: activityOb.detailId} } },
                function (err, trip) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                }
            );
    }
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
