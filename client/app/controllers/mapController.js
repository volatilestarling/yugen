angular.module('whereTo.map', [])

.controller('MapController', function($scope, $state, MapService, Location, Detail, $rootScope) {
  $scope.location = '';
  $scope.locations = ["Thailand", "China", "Japan"];
  $scope.tab = 1;

/*---------------- INITIALIZE MAP ---------------*/
  var map = MapService.initMap();
  var autocomplete = new google.maps.places.Autocomplete((document.getElementById('search')), {
        types: ["geocode"]
    });

/*-------------- FETCH SAVED LOCATIONS -------------*/

  $scope.fetchMarkers = function() {
    console.log($rootScope.user);
    var data = {user: $rootScope.user};
    Location.getLocations(JSON.stringify(data))
      .then(function(locations) {
        $scope.locations = locations;
        for(var place in locations) {
          $scope.pinMap(place);
        }
      });
  };

  $scope.fetchMarkers();
  console.log($scope.locations, "nope")

/*------------------- USER INPUT ------------------*/
  $scope.pinMap = function(location) {
    var result = autocomplete.getPlace();
    console.log(result);

    //location passed from call in fetchMarkers or user input
    location = location || result.name;
    $scope.location = location;


    //send to geocoder in mapservice
    var geocoder = new google.maps.Geocoder();

/*---------------- USER INPUT ---------------*/
    //reference to user places list

    $scope.tab = 1;
    $scope.showTab = function(num) {
      $scope.tab = num;
    }

    geocoder.geocode({
        address: $scope.location
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              animation: google.maps.Animation.DROP,
              icon: './assets/airplane.png'
          });

        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });

    //if it is a new location, add it to the user's list
    console.log('$rootScope.user =', $rootScope.user);
    console.log('location =', location);
    if(result.name !== undefined) {
      var data = {
        location: location,
        user: $rootScope.user
        //city: ,
        //country:
      };
      
      Location.addLocations(data);
      
    }

    $scope.map.location = '';
  };

  $scope.getLocData = function() {
    //need to pass user, city, country
    Detail.locationDetails()
  }

});
