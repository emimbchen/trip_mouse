myApp.service('UserService', function($http, $location){
  // console.log('UserService Loaded');
  var self = this;
  //userObject (holds user info)
  self.userObject = {};
  //object to hold results of getTrips();
  self.tripObject = {};
  //object to hold active trip from selectTrip();
  self.currentTrip = {totalCost: 0, costPerPerson: 0};
  //gets todays date
  var today = (new Date()).toISOString();
  
  //sorting sorts trips according to their relativity to today's date
  self.sortTrips = function (tripArray) {
    self.tripObject.currentTrips = [];
    self.tripObject.pastTrips = [];
    for (var i = 0; i < tripArray.length; i++) {
      var currentTrip = tripArray[i];
      if (currentTrip.returnDate < today) {
        self.tripObject.pastTrips.push(currentTrip);
      } else {
        self.tripObject.currentTrips.push(currentTrip);
      }
    }
  }

  //gets trips and calls sortTrips to sort them for the home page
  //stored in self.tripObject.Trips
  self.getTrips = function (){
    return $http.get('/trip').then(function(response) {
      self.tripObject.trips = response.data;
      self.sortTrips(self.tripObject.trips);
    }).catch(function (error) {
      console.log('failure on GET trip route');
    });
  }

  //calculates total cost and cost per person for confirmed details
  function calculateCosts(arrayIn){
    if(arrayIn.length === 0){
      // console.log('array has no length');
      return 0;
    }
    var travellers = self.currentTrip.data.travellers;
    for( var i = 0; i < arrayIn.length; i++){
      // console.log(arrayIn);
      var total = 0; 
      if ( arrayIn[i].price.for === 'Total' ) {
        total += parseInt(arrayIn[i].price.cost);
        // console.log("totalIn",parseInt(arrayIn[i].price.cost));
        
      }
      if ( arrayIn[i].price.for === 'Per Person') {
        total += arrayIn[i].price.cost * travellers;
        // console.log("per person",parseInt(arrayIn[i].price.cost));
        
      }
    // console.log('total', total);
    return total;
  }
}

  //sorts the confirmed details into respective categories
  //also sorts details into arrays in respective dates
  self.sortDetails = function (dataObject) {
    self.currentTrip.transportation = [];
    self.currentTrip.lodging = [];
    self.currentTrip.activity = [];
    // console.log(dataObject);
    sortTransportation(dataObject);
    sortLodgings(dataObject);
    sortActivities(dataObject);
    sortingTransportations(self.currentTrip.transportation);
    sortingLodgings(self.currentTrip.lodging);
    sortingActivities(self.currentTrip.activity);
    //calculates total & cost per person
    var transportationTotal = calculateCosts(self.currentTrip.transportation);
    var lodgingTotal = calculateCosts(self.currentTrip.lodging);
    var activityTotal = calculateCosts(self.currentTrip.activity);
    self.currentTrip.totalCost = (transportationTotal + lodgingTotal + activityTotal);
    self.currentTrip.costPerPerson = (transportationTotal+ lodgingTotal + activityTotal)/ self.currentTrip.data.travellers; 
  }

    //sorts confirmed transportations from transportation array
    function sortTransportation(dataObject){
      for (var i = 0; i < dataObject.transportation.length; i++) {
        if(dataObject.transportation[i].confirmed === true){
          self.currentTrip.transportation.push(dataObject.transportation[i]);
        }
    }
  }
    //sorts confirmed lodging from lodging array
    function sortLodgings(dataObject) {
      // console.log('Data Object Lodging', dataObject);
      for (var i = 0; i < dataObject.lodging.length; i++) {
        if (dataObject.lodging[i].confirmed === true) {
          self.currentTrip.lodging.push(dataObject.lodging[i]);
          
        }
      }
    }
    //sorts confirmed activities from activities array
    function sortActivities(dataObject) {
      for (var i = 0; i < dataObject.activities.length; i++) {
        if (dataObject.activities[i].confirmed === true) {
          self.currentTrip.activity.push(dataObject.activities[i]);
          
        }
      }
    }

  //loop through dateArray and add detail to the date 
  function sortingTransportations(detailArray){
    for (var j = 0; j < detailArray.length; j++){
      var currentDetail = detailArray[j];
      for(var n = 0; n < self.currentTrip.dateArray.length; n++){
        if (currentDetail.date === (self.currentTrip.dateArray[n].date).toISOString()){
          self.currentTrip.dateArray[n].transportations.push(currentDetail);
        }
      }
    }
  }

  //loop through dateArray and add detail to the date 
  function sortingLodgings(detailArray) {
    // console.log('lodging sorting hat!');
    for (var j = 0; j < detailArray.length; j++) {
      var currentDetail = detailArray[j];
      // console.log(self.currentTrip);
      for (var k = 0; k < self.currentTrip.dateArray.length; k++) {
        // self.currentTrip.dateArray[k].lodgings = [];
        if (currentDetail.checkIn === (self.currentTrip.dateArray[k].date).toISOString()) {
          self.currentTrip.dateArray[k].lodgings.push(currentDetail);
          // console.log(self.currentTrip);
        }
      }
    }
  }

  //loop through dateArray and add detail to the date 
  function sortingActivities(detailArray) {
    // console.log('activities sorting hat!');
    for (var j = 0; j < detailArray.length; j++) {
      var currentDetail = detailArray[j];
      // console.log(self.currentTrip);
      for (var k = 0; k < self.currentTrip.dateArray.length; k++) {
        // self.currentTrip.dateArray[k].activities = [];
        if (currentDetail.when === (self.currentTrip.dateArray[k].date).toISOString()) {
          self.currentTrip.dateArray[k].activities.push(currentDetail);
          // console.log(self.currentTrip);
        }
      }
    }
  }

  //gets selected trip and details and sorts itinerary
  self.getThisTrip = function (id) {
    $http.get('/trip/' + id).then(function (response) {
      self.currentTrip.data = response.data;
      self.dateRange(self.currentTrip.data.leaveDate, self.currentTrip.data.returnDate);
      self.sortDetails(self.currentTrip.data);
      console.log(self.currentTrip);
    }).catch(function (error) {
      console.log('failure on Get specific trip route');
    })
  }

  //creates a dateRange for the daily itinerary
  self.dateRange = function (startDate, endDate) {
    var date = moment(startDate);
    var endDate = moment(endDate);
    self.currentTrip.dateArray = [];
    while (date <= endDate) {
      self.currentTrip.dateArray.push({date: date.toDate(), lodgings: [], transportations: [], activities: []});
      date = date.clone().add(1, 'd');
    }
  }

  //get user function
  self.getuser = function(){
    console.log('UserService -- getuser');
    $http.get('/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/home");
    });
  },

  //log out function
  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  }
});




