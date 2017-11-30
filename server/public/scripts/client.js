var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config')
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/info/:tripId', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController as ic',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/newtrip', {
      templateUrl: '/views/templates/newtrip.html',
      controller: 'NewTripController as nc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/usernav', {
      templateUrl: 'views/partials/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser: function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/tripnav', {
      templateUrl: 'views/partials/tripnav.html',
      controller: 'InfoController as ic',
      resolve: {
        getuser: function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/itinerarynav', {
      templateUrl: 'views/partials/itinerary.html',
      controller: 'itineraryGlanceController as ig',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/itineraryGlance/:tripId', {
      templateUrl: 'views/templates/itineraryGlance.html',
      controller: 'itineraryGlanceController as ig',
      resolve: {
        getuser: function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/itineraryDaily/:tripId', {
      templateUrl: 'views/templates/dailyItinerary.html',
      controller: 'itineraryDailyController as id',
      resolve: {
        getuser: function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/itinerarydaily', {
      templateUrl: 'views/partials/itinerary2.html',
      controller: 'itineraryDailyController as id',
      resolve: {
        getuser:function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });
});
