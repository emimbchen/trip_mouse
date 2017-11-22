myApp.controller('InfoController', function(UserService, $mdDialog, $routeParams, $http, $location) {
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
      controller: 'InfoController as ic',
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
      controller: 'InfoController as ic',
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
      controller: 'InfoController as ic',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
  }

  vm.showAdvanced3 = function (ev) {
    $mdDialog.show({
      templateUrl: '../views/partials/dialog4.html',
      controller: 'InfoController as ic',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
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
      vm.showEdit = false;
      vm.getThisTrip(tripId);
    }).catch(function(error){
      console.log('update not sent :(');
    })
  }

  vm.deleteTrip = function(){
    $http.delete('/trip/' + tripId).then(function(response){
      console.log('delete sent');
      $location.path('/user');
    }).catch(function(error){
      console.log('delete not sent');
    })
  }

  vm.newDetail = function(objectTosend, type) {
    console.log('Submit Clicked');
    console.log(objectTosend, type);
    $http.put('/trip/' + type + '/' + tripId, objectTosend).then(function (response) {
      console.log('new', type, 'sent');
      $mdDialog.hide();
      vm.getThisTrip(tripId);
    }).catch(function (error) {
      console.log('update not sent :(');
    })
  }


});