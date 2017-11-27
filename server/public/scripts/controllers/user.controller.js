myApp.controller('UserController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.tripObject = UserService.tripObject;
  //get route for all trips
  vm.getTrips = function(){
    UserService.getTrips();
  }
  vm.selectTrip = function(id){
    UserService.selectTrip(id);
  }
  
  vm.getTrips();

  //route to delete this trip deletes entire trip
  //will move this to user page
  vm.deleteTrip = function (tripId) {
    console.log(tripId);
    $http.delete('/trip/'+tripId).then(function (response) {
      vm.getTrips();
    }).catch(function (error) {
      console.log('delete not sent');
    })
  }
});



