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

  //function to select current trip
  self.selectTrip= function(id){
    console.log('trip selected');
    self.getThisTrip(id);
    console.log('Current Trip Id', id);
  }
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

  //gets trips and sorts them
  self.getTrips = function (){
    return $http.get('/trip').then(function(response) {
      self.tripObject.trips = response.data;
      self.sortTrips(self.tripObject.trips);
      console.log('tripObject: ', self.tripObject);
    }).catch(function (error) {
      console.log('failure on GET trip route');
    });
  }

  //gets selected trip and details
  self.getThisTrip = function (id) {
    $http.get('/trip/' + id).then(function (response) {
      self.currentTrip.data = response.data;
      console.log('current trip details', self.currentTrip);
    }).catch(function (error) {
      console.log('failure on Get specific trip route');
    })
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




