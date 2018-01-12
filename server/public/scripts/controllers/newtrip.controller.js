myApp.controller('NewTripController', function ($http, $location, UserService) {
    var vm = this;
    vm.userService = UserService;
    
    vm.submitTrip = function(tripToSend){
        $http.post('/trip', tripToSend).then(function(response){
            $location.path('/userhome');
        }).catch(function(err){
            console.log('error in submit trip', err);
        });
    }
});
