myApp.controller('UserController', function(UserService, $http, $mdDialog) {
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
  vm.deleteTrip = function (tripId) {
    console.log(tripId);
    $http.delete('/trip/'+ tripId).then(function (response) {
      vm.getTrips();
    }).catch(function (error) {
      console.log('delete not sent');
    })
  }

  //function to show confirmation for detail delete
  vm.showConfirm = function (ev, id) {
    var confirm = $mdDialog.confirm()
      .title('Would you like to delete this trip perminantly?')
      .ariaLabel('confirm')
      .targetEvent(ev)
      .ok('Yes, Delete This Trip')
      .cancel('Cancel')
    $mdDialog.show(confirm).then(function () {
      //delete function
      vm.deleteTrip(id);
    }, function () {

    });
  };
});



