var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

//nested transportation schema
var TransportationSchema = new Schema({
    type: String,
    from: String,
    to: String,
    date: Date,
    leaveTime: Date,
    arriveTime: Date,
    price: Number,
    details: String

});

//nested lodging schema
var LodgingSchema = new Schema({
    name: String,
    checkIn: Date,
    checkOut: Date,
    address: String,
    phoneNumber: Number,
    website: String,
    price: Number,
    details: String
});

//nested activities schema
var ActivitiesSchema = new Schema({
    activity: String,
    where: String,
    when: Date,
    price: Number,
    details: String
});

//trip collection schema
var TripSchema = new Schema({
    userId: Schema.Types.ObjectId,
    tripDestination: String,
    leaveDate: Date,
    returnDate: Date,
    travellers: Number,
    transportation: [TransportationSchema],
    lodging: [LodgingSchema],
    activities: [ActivitiesSchema],
    itinerary:[]
});


module.exports = mongoose.model('trip', TripSchema, 'trips');