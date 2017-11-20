myApp.controller('InfoController', function(UserService, $http) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;
  vm.getThisTrip = function(){
    UserService.getThisTrip();
  }

  vm.getThisTrip();
});