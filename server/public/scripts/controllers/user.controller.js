myApp.controller('UserController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.trips;
  vm.currentTrips = [];
  vm.pastTrips = [];
  var today = Date.now();
  console.log(Date.now());
  //get route for all trips
  getTrips = function(){
    $http.get('/trip').then(function (response) {
      vm.trips = response.data;
      console.log(vm.trips);
    }).catch(function (error) {
      console.log('failure on GET trip route');
    });
  }
  getTrips();
});

function sortTrips(array){
  for (var i = 0; i < array.length; i++){

  }
}

