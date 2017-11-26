myApp.controller('InfoController', function(UserService, $mdDialog, $routeParams, $http, $location) {
  console.log('InfoController created');
  var vm = this;
  vm.userService = UserService;
  vm.thisTrip = UserService.currentTrip;
  vm.showEdit = false;
  vm.transportOptions = [ {type: 'Airplane', icon: 'flight' }, { type: 'Train', icon: 'train'}, {type: 'Subway', icon: 'subway'}, {type: 'Car', icon: 'directions_car'}, {type: 'Taxi', icon: "local_taxi"}, {type: 'Other', icon: "navigation"}];
  
  var tripId = $routeParams.tripId;
  console.log(tripId);

  vm.getThisTrip = function(id){
    UserService.getThisTrip(id);
  }

  vm.getThisTrip(tripId);

  //function to show transportation partial
  vm.showAdvanced = function(ev){
    $mdDialog.show({
      templateUrl: '../views/partials/dialog1.html',
      controller: 'InfoController as ic',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
  }
  //function to show lodging partial
  vm.showAdvanced1 = function (ev) {
    $mdDialog.show({
      templateUrl: '../views/partials/dialog2.html',
      controller: 'InfoController as ic',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    })
  }
//function to show activity partial
  vm.showAdvanced2 = function (ev) {
    $mdDialog.show({
      templateUrl: '../views/partials/dialog3.html',
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

  //edit trip object
  vm.editTrip = function (objectTosend) {
    $http.put('/trip/' + tripId, objectTosend).then(function (response) {
      console.log('update sent');
      vm.showEdit = false;
      vm.getThisTrip(tripId);
    }).catch(function (error) {
      console.log('update not sent :(');
    })
  }

  //route to delete this trip
  vm.deleteTrip = function(){
    $http.delete('/trip/' + tripId).then(function(response){
      console.log('delete sent');
      $location.path('/user');
    }).catch(function(error){
      console.log('delete not sent');
    })
  }

  //route to add a new detail
  vm.newDetail = function(objectTosend, type, action, detailId) {
    console.log(objectTosend, type, action, detailId);
    objectTosend.action = action; 
    objectTosend.detailId = detailId;
    $http.put('/trip/' + type + '/' + tripId, objectTosend).then(function (response) {
      console.log('new', type, 'sent');
      $mdDialog.hide();
      vm.getThisTrip(tripId);
    }).catch(function (error) {
      console.log('update not sent :(');
    })
  }


});