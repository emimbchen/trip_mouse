myApp.service('UserService', function($http, $location){
  // console.log('UserService Loaded');
  var self = this;
  //userObject (holds user info)
  self.userObject = {};
  //object to hold results of getTrips();
  self.tripObject = {};
  //object to hold active trip from selectTrip();
  self.currentTrip = {};
  
  var today = (new Date()).toISOString();
  
  // //function to select current trip
  // self.selectTrip= function(id){
  //   console.log('trip selected');
  //   self.getThisTrip(id);
  //   console.log('Current Trip Id', id);
  // }
  
  //sorting function
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

  //gets trips and sorts them for the home page
  self.getTrips = function (){
    return $http.get('/trip').then(function(response) {
      self.tripObject.trips = response.data;
      self.sortTrips(self.tripObject.trips);
    }).catch(function (error) {
      console.log('failure on GET trip route');
    });
  }

  //sorts the confirmed details into respective categories
  self.sortDetails = function (dataObject) {
    self.currentTrip.transportation = [];
    self.currentTrip.lodging = [];
    self.currentTrip.activity = [];
    sortTransportation(dataObject);
    sortLodgings(dataObject);
    sortActivities(dataObject);
  }

    //sorts confirmed transportations from transportation array
    function sortTransportation(dataObject){
      for (var i = 0; i < dataObject.transportation.length; i++) {
        if(dataObject.transportation[i].confirmed === true){
          self.currentTrip.transportation.push(dataObject.transportation[i]);
          sortingTransportations(self.currentTrip.transportation);
        }
    }
  }
    //sorts confirmed lodging from lodging array
    function sortLodgings(dataObject) {
      for (var i = 0; i < dataObject.lodging.length; i++) {
        if (dataObject.lodging[i].confirmed === true) {
          self.currentTrip.lodging.push(dataObject.lodging[i]);
          sortingLogdings(self.currentTrip.lodging);
        }
      }
    }
    //sorts confirmed activities from activities array
    function sortActivities(dataObject) {
      for (var i = 0; i < dataObject.activities.length; i++) {
        if (dataObject.activities[i].confirmed === true) {
          self.currentTrip.activity.push(dataObject.activities[i]);
          sortingActivities(self.currentTrip.activity)
        }
      }
    }

  //loop through dateArray and add detail to the date 
  function sortingTransportations(detailArray){
    console.log('sorting hat!');
    for (var j = 0; j < detailArray.length; j++){
      var currentDetail = detailArray[j];
      console.log(self.currentTrip);
      for(var k = 0; k < self.currentTrip.dateArray.length; k++){
        self.currentTrip.dateArray[k].events = [];
        if (currentDetail.date === (self.currentTrip.dateArray[k].date).toISOString()){
          self.currentTrip.dateArray[k].events.push(currentDetail);
          console.log(self.currentTrip);
        }
      }
    }
  }

  //loop through dateArray and add detail to the date 
  function sortingLodgings(detailArray) {
    console.log('sorting hat!');
    for (var j = 0; j < detailArray.length; j++) {
      var currentDetail = detailArray[j];
      console.log(self.currentTrip);
      for (var k = 0; k < self.currentTrip.dateArray.length; k++) {
        self.currentTrip.dateArray[k].events = [];
        if (currentDetail.checkIn === (self.currentTrip.dateArray[k].date).toISOString()) {
          self.currentTrip.dateArray[k].events.push(currentDetail);
          console.log(self.currentTrip);
        }
      }
    }
  }

  //loop through dateArray and add detail to the date 
  function sortingActivities(detailArray) {
    console.log('sorting hat!');
    for (var j = 0; j < detailArray.length; j++) {
      var currentDetail = detailArray[j];
      console.log(self.currentTrip);
      for (var k = 0; k < self.currentTrip.dateArray.length; k++) {
        self.currentTrip.dateArray[k].events = [];
        if (currentDetail.when === (self.currentTrip.dateArray[k].date).toISOString()) {
          self.currentTrip.dateArray[k].events.push(currentDetail);
          console.log(self.currentTrip);
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
      self.currentTrip.dateArray.push({date: date.toDate()});
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




