myApp.controller('NewTripController', function (UserService, $http, $location) {
    console.log('NewTripController created');
    var vm = this;
    vm.userService = UserService;
    
    vm.submitTrip = function(tripToSend){
        console.log(tripToSend);
        $http.post('/trip', tripToSend).then(function(response){
            console.log(response);
            $location.path('/user');
        }).catch(function(err){
            console.log('error in submit trip', err);
        });
    }
});
