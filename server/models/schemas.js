var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

//nested transportation schema
var TransportationSchema = new Schema({
    type: Object,
    from: String,
    to: String,
    date: Date,
    leaveTime: Date,
    arriveTime: Date,
    price: Object,
    details: String,
    confirmed: { type: Boolean, default: false }

});

//nested lodging schema
var LodgingSchema = new Schema({
    name: String,
    checkIn: Date,
    checkOut: Date,
    address: String,
    lat: Number,
    long: Number,
    phoneNumber: String,
    website: String,
    price: Object,
    details: String,
    confirmed: { type: Boolean, default: false }
});

//nested activities schema
var ActivitiesSchema = new Schema({
    activity: String,
    where: String,
    lat: Number,
    long: Number,
    when: Date,
    website: String,
    price: Object,
    details: String,
    confirmed: {type: Boolean, default: false}
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
    activities: [ActivitiesSchema]
});


module.exports = mongoose.model('trip', TripSchema, 'trips');