myApp.controller('itineraryGlanceController', function (UserService, $routeParams) {
    console.log('itineraryGlanceController created');
    var self = this;
    self.userService = UserService;
    //current trip id
    self.tripId = $routeParams.tripId;
    self.thisTrip = UserService.currentTrip;

    //function to get trips (Created and called)
    self.getThisTrip = function (id) {
        UserService.getThisTrip(id);
    }
    self.getThisTrip(self.tripId);
});