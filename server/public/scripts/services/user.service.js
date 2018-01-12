myApp.service('UserService', function ($http, $location) {
  var self = this;
  //userObject (holds user info)
  self.userObject = {};
  //object to hold results of getTrips();
  self.tripObject = {};
  //object to hold active trip from selectTrip();
  //holds totalCost and cost Per Person
  self.currentTrip = { totalCost: 0, costPerPerson: 0 };

  //gets todays date
  var today = (new Date()).toISOString();

  //sorting sorts trips according to their relativity to today's date
  self.sortTrips = function (tripArray) {
    self.tripObject.currentTrips = [];
    self.tripObject.pastTrips = [];
    for (var i = 0; i < tripArray.length; i++) {
      var currentTrip = tripArray[i];
      if (currentTrip.returnDate < today) {
        self.tripObject.pastTrips.push(currentTrip);
      } else {
        self.tripObject.currentTrips.push(currentTrip);
      }
    }
  }

  //gets trips and calls sortTrips to sort them for the home page
  //stored in self.tripObject.Trips
  self.getTrips = function () {
    return $http.get('/trip').then(function (response) {
      self.tripObject.trips = response.data;
      self.sortTrips(self.tripObject.trips);
    }).catch(function (error) {
    });
  }

  //calculates total cost and cost per person for confirmed details
  function calculateCosts(arrayIn) {
    var total = 0;
    if (arrayIn.length === 0) {
      return 0;
    }
    var travellers = self.currentTrip.data.travellers;
    for (var i = 0; i < arrayIn.length; i++) {
      if (arrayIn[i].price.for === 'Total') {
        total += parseInt(arrayIn[i].price.cost);
      }
      if (arrayIn[i].price.for === 'Per Person') {
        total += parseInt(arrayIn[i].price.cost) * travellers;
      }
    }    
    return total;
  }

  //sorts the confirmed details into respective categories
  //also sorts details into arrays in respective dates
  self.sortDetails = function (dataObject) {
    self.currentTrip.transportation = [];
    self.currentTrip.lodging = [];
    self.currentTrip.activity = [];
    sortTransportation(dataObject);
    sortLodgings(dataObject);
    sortActivities(dataObject);
    self.currentTrip.transportation = sortingTransportations(self.currentTrip.transportation);
    sortingLodgings(self.currentTrip.lodging);
    sortingActivities(self.currentTrip.activity);
    //calculates total & cost per person
    var transportationTotal = calculateCosts(self.currentTrip.transportation);
    var lodgingTotal = calculateCosts(self.currentTrip.lodging);
    var activityTotal = calculateCosts(self.currentTrip.activity);
    //rounding to two decimal points
    var totalCost = (transportationTotal + lodgingTotal + activityTotal);
    self.currentTrip.totalCost = totalCost.toFixed(2);
    self.currentTrip.costPerPerson = (totalCost / self.currentTrip.data.travellers).toFixed(2);
  }

  //sorts confirmed transportations from transportation array
  function sortTransportation(dataObject) {
    for (var i = 0; i < dataObject.transportation.length; i++) {
      if (dataObject.transportation[i].confirmed === true) {
        self.currentTrip.transportation.push(dataObject.transportation[i]);
      }
    }
  }
  //sorts confirmed lodging from lodging array
  function sortLodgings(dataObject) {
    for (var i = 0; i < dataObject.lodging.length; i++) {
      if (dataObject.lodging[i].confirmed === true) {
        self.currentTrip.lodging.push(dataObject.lodging[i]);

      }
    }
  }
  //sorts confirmed activities from activities array
  function sortActivities(dataObject) {
    for (var i = 0; i < dataObject.activities.length; i++) {
      if (dataObject.activities[i].confirmed === true) {
        self.currentTrip.activity.push(dataObject.activities[i]);

      }
    }
  }

  //loop through dateArray and add detail to the date 
  function sortingTransportations(detailArray) {
    for (var j = 0; j < detailArray.length; j++) {
      detailArray[j].leaveTime = new Date(detailArray[j].leaveTime);
      detailArray[j].arriveTime = new Date(detailArray[j].arriveTime);
      var currentDetail = detailArray[j];
      for (var n = 0; n < self.currentTrip.dateArray.length; n++) {
        if (currentDetail.date === (self.currentTrip.dateArray[n].date).toISOString()) {
          self.currentTrip.dateArray[n].transportations.push(currentDetail);
        }
      }
    }
    return detailArray;
  }

  //loop through dateArray and add  lodgings detail to the date 
  function sortingLodgings(detailArray) {
    for (var j = 0; j < detailArray.length; j++) {
      var currentDetail = detailArray[j];
      for (var k = 0; k < self.currentTrip.dateArray.length; k++) {
        if (currentDetail.checkIn === (self.currentTrip.dateArray[k].date).toISOString()) {
          self.currentTrip.dateArray[k].lodgings.push(currentDetail);
        }
      }
    }
  }

  //loop through dateArray and add activities detail to the date 
  function sortingActivities(detailArray) {
    for (var j = 0; j < detailArray.length; j++) {
      var currentDetail = detailArray[j];
      for (var k = 0; k < self.currentTrip.dateArray.length; k++) {
        if (currentDetail.when === (self.currentTrip.dateArray[k].date).toISOString()) {
          self.currentTrip.dateArray[k].activities.push(currentDetail);
        }
      }
    }
  }

  //gets selected trip and details and sorts itinerary
  self.getThisTrip = function (id) {
    $http.get('/trip/' + id).then(function (response) {
      self.currentTrip.data = response.data;
      console.log(response.data);

      self.dateRange(self.currentTrip.data.leaveDate, self.currentTrip.data.returnDate);
      self.sortDetails(self.currentTrip.data);
    }).catch(function (error) {
      console.log('failure on Get specific trip route');
    })
  }

  //creates a dateRange for the daily itinerary
  self.dateRange = function (startDate, endDate) {
    var date = moment(startDate);
    var endDate = moment(endDate);
    self.currentTrip.dateArray = [];
    while (date <= endDate) {
      self.currentTrip.dateArray.push({ date: date.toDate(), lodgings: [], transportations: [], activities: [] });
      date = date.clone().add(1, 'd');
    }
  }

  //get user function
  self.getuser = function () {
    $http.get('/user').then(function (response) {
      if (response.data.username) {
        // user has a curret session on the server
        self.userObject.userName = response.data.username;
      } else {
        console.log('UserService -- getuser -- failure');
        // user has no session, bounce them back to the login page
        $location.path("/login");
      }
    }, function (response) {
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/login");
    });
  },

    //log out function
    self.logout = function () {
      $http.get('/user/logout').then(function (response) {
        $location.path("/login");
      });
    }
});




