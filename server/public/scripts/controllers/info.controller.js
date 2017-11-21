myApp.controller('InfoController', function(UserService, $mdDialog, $routeParams) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;
  vm.thisTrip = UserService.currentTrip;
  
  var tripId = $routeParams.tripId;
  console.log(tripId);

  vm.getThisTrip = function(id){
    UserService.getThisTrip(id);
  }

  vm.getThisTrip(tripId);

  vm.showAdvanced = function(ev){
    $mdDialog.show({
      templateUrl: '../views/partials/dialog1.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    }).then(function(answer){
      vm.status = 'Answer: ', answer ;
      }), function () {
        vm.status = 'You cancelled the dialog.';
      }
  }

  

});