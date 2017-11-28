myApp.controller('itineraryDailyController', function (UserService, $routeParams) {
    console.log('itineraryDailyController created');
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
      var startDate = (new Date('2018,01,26'));
    console.log('StartDate', startDate);

    function dateConverter(isoDate){
        var date = {};
        // date.year = isoDate.getFullYear();
        date.month = isoDate.getMonth() + 1;
        date.day = isoDate.getDate();
        return date;
    }
    console.log(dateConverter('2018 - 01 - 26T06:00:00.000Z'));
    

});

// function arrayOfDates(startDate, endDate){
//     var dates = [];
//     for(var i = startDate; i <= endDate; i++ )
// };
