myApp.controller('InfoController', function(UserService, $mdDialog, $routeParams, $http) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;
  vm.thisTrip = UserService.currentTrip;
  vm.showEdit = false;
  
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
    })
    // .then(function(answer){
    //   vm.status = 'Answer: ', answer ;
    //   console.log(answer);
    //   }), function () {
    //     vm.status = 'You cancelled the dialog.';
    //   }
  }

  vm.showAdvanced1 = function (ev) {
    $mdDialog.show({
      templateUrl: '../views/partials/dialog2.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
    // .then(function (answer) {
    //   vm.status = 'Answer: ', answer;
    // }), function () {
    //   vm.status = 'You cancelled the dialog.';
    // }
  }

  vm.showAdvanced2 = function (ev) {
    $mdDialog.show({
      templateUrl: '../views/partials/dialog3.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
    // .then(function (answer) {
    //   vm.status = 'Answer: ', answer;
    // }), function () {
    //   vm.status = 'You cancelled the dialog.';
    // }
  }

  vm.showAdvanced3 = function (ev) {
    $mdDialog.show({
      templateUrl: '../views/partials/dialog4.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
    // .then(function (answer) {
    //   vm.status = 'Answer: ', answer;
    // }), function () {
    //   vm.status = 'You cancelled the dialog.';
    // }
  }

  vm.editInputs = function(){
    vm.showEdit = true;
  }

  vm.hideEdit = function() {
    vm.showEdit = false;
  }

  vm.editTrip = function(objectTosend){
    $http.put('/trip/' + tripId, objectTosend).then(function(response){
      console.log('update sent');
    }).catch(function(error){
      console.log('update not sent :(');
    })
  }

  vm.deleteTrip = function(){
    $http.delete('/trip/' + tripId).then(function(response){
      console.log('delete sent');
    }).catch(function(error){
      console.log('delete not sent');
    })
  }


});