myApp.controller('UserController', function(UserService) {
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

});



