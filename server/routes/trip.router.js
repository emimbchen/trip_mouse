var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require('path');
var tripObject = require('../models/schemas.js');

var tripId ="";

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
// router.get('/:id', function (req, res) {
//         if(req.params.id === undefined){
//             console.log(tripId);
//             console.log('no new id');
//     tripObject.findById({_id: tripId }).exec(function (err, foundObjects) {
//         if (err) {
//             console.log('error', err);
//             res.sendStatus(500);
//         } else {
//             res.send(foundObjects);
//         }
//     });
//     } else {
//             tripId = req.params.id;
//             tripObject.findById({ _id: tripId }).exec(function (err, foundObjects) {
//                 if (err) {
//                     console.log('error', err);
//                     res.sendStatus(500);
//                 } else {
//                     res.send(foundObjects);
//                 }
//             });
//     }
// })

//route to get selected trip
router.get('/:id', function (req, res) {
    tripId = req.params.id;
    tripObject.findById({ _id: tripId }).exec(function (err, foundObjects) {
        if (err) {
            console.log('error', err);
            res.sendStatus(500);
        } else {
            res.send(foundObjects);
        }
    });
})

router.get('/undefined', function (req, res) {
    tripObject.findById({ _id: tripId }).exec(function (err, foundObjects) {
        if (err) {
            console.log('error', err);
            res.sendStatus(500);
        } else {
            res.send(foundObjects);
        }
    });
})





module.exports = router;
