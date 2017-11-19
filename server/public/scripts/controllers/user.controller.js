myApp.controller('UserController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.trips;
  vm.currentTrips = [];
  vm.pastTrips = [];
  var today = (new Date()).toISOString();
  console.log(today);

  //trip sorting
  vm.sortTrips = function (tripArray) {
    vm.currentTrips = [];
    vm.pastTrips = [];
    console.log(tripArray);
    for (var i = 0; i < tripArray.length; i++) {
      var currentTrip = tripArray[i];
      if (currentTrip.returnDate < today) {
        vm.pastTrips.push(currentTrip);
      } else {
        vm.currentTrips.push(currentTrip);
      }
    }
  }

  //get route for all trips
  getTrips = function(){
    $http.get('/trip').then(function (response) {
      vm.trips = response.data;
      vm.sortTrips(vm.trips);
    }).catch(function (error) {
      console.log('failure on GET trip route');
    });
  }

  getTrips();


});



