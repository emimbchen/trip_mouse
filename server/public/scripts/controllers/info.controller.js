myApp.controller('InfoController', function(UserService, $mdDialog, $routeParams, $http, $location) {
  var vm = this;
  //variables
  vm.userService = UserService;
  //get current trip data from user service
  vm.thisTrip = UserService.currentTrip;
  
  //show Edit for general trip editing (not details)
  vm.showEdit = false;
  //transportation options for ng-repeat
  vm.transportOptions = [{ type: 'Airplane', icon: 'flight' }, { type: 'Train', icon: 'train' }, { type: 'Bus', icon: 'directions_bus'}, {type: 'Subway', icon: 'subway'}, {type: 'Car', icon: 'directions_car'}, {type: 'Taxi', icon: "local_taxi"}, {type: 'Boat', icon: "directions_boat"}, {type: 'Other', icon: "navigation"}];
  //current trip Id from the Url
  var tripId = $routeParams.tripId;
  // console.log(tripId);
  //variable to trigger detail accordian
  vm.selectedItem = null; 
  //variable to trigger edit view
  vm.selectedDetail = null;

  //set price defaults to zero
  vm.transportation = {price : { for: 'total' , cost: 0}};
  vm.lodging = { price: { for: 'total', cost: 0 } };
  vm.activity = { price: { for: 'total', cost: 0 } };

  //functions for hiding details for the drop down
  vm.setItem = function(i){
    vm.selectedItem = i;
  }
  vm.editDetail = function(detailIndex){
    vm.selectedDetail = detailIndex;
  }

  //edit trip show and hide
  vm.editInputs = function () {
    vm.showEdit = true;
  }
  //hides all expanded things
  vm.hideEdit = function () {
    vm.showEdit = false;
    vm.selectedItem = null;
    vm.selectedDetail = null;
  }

  //function to get trips (Created and called)
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

  //experiemental var
  // vm.latLng;

  // //geocode experiment
  // function searchAddress(address, detailId) {
  //   var geocoder = new google.maps.Geocoder();
  //   geocoder.geocode({ address: address }, function (results, status) {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       var lat = results[0].geometry.location.lat();
  //       var lng = results[0].geometry.location.lng();
  //       console.log(address, ':', lat, lng);
  //       vm.latLng.push({ detailId: detailId, lat: lat, lng: lng });
  //       console.log(vm.latLng);
        
  //     }
  //   })
  // }

  //function to show confirmation for detail delete
  vm.showConfirm = function (ev, objectTosend, type, action, detailId){
    var confirm = $mdDialog.confirm()
    .title('Would you like to delete this detail perminantly?')
    .ariaLabel('confirm')
    .targetEvent(ev)
    .ok('Yes, Delete This Detail')
    .cancel('Cancel')
    $mdDialog.show(confirm).then(function (){
    //delete function
      vm.newDetail(objectTosend, type, action, detailId);
  }, function(){

  });
  };

  //function to close dialogs
  vm.cancel = function(){
    $mdDialog.cancel();
  }
  //edit general trip object
  vm.editTrip = function (objectTosend) {
    $http.put('/trip/' + tripId, objectTosend).then(function (response) {
      vm.showEdit = false;
      vm.getThisTrip(tripId);
    }).catch(function (error) {
      console.log('update not sent', error);
    })
  }

  //ROUTE FOR ALL TRIP DETAIL EDITS EDITS
  // which route is determined by type: transportation, lodging, activities
  //which action in switch: edit, delete, add, confirm, unconfirm
  //detail id: id of the specific detail (necessary for edit and delete)
  vm.newDetail = function(objectTosend, type, action, detailId) {
    if(action == 'confirm') {
      objectTosend.confirmed = true;
      // if(type === 'lodging'){
      //   console.log('lodging geo');
      //   searchAddress(objectTosend.address, detailId);
      // } 
      // if(type === 'activities'){
      //   console.log('acvitivies geo');
      //   searchAddress(objectTosend.where, detailId);
      // }    
    }
    if(action == 'unconfirm'){
      objectTosend.confirmed= false;
    }
    objectTosend.action = action; 
    objectTosend.detailId = detailId;
    $http.put('/trip/' + type + '/' + tripId, objectTosend).then(function (response) {
      $mdDialog.hide();
      vm.getThisTrip(tripId);
      vm.hideEdit();
    }).catch(function (error) {
      console.log('update not sent', error);
    })
  }
});