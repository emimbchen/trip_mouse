myApp.controller('PartialController', function (UserService, $routeParams) {
    console.log('PartialController created');
    var vm = this;
    vm.userService = UserService;

    var tripId = $routeParams.tripId;
    console.log(tripId);
});