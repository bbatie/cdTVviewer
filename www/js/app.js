// Ionic Starter App





// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('map', {
        url: '/',
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      });

    $urlRouterProvider.otherwise("/");

  })






  .controller('MapCtrl', function($scope, $state, $firebaseArray) {


    $scope.lastUpdate = '';

    var config = {
      /*  apiKey: "AIzaSyCU2ICgeFh3r3pvqWmj3cUj4DIjNgIxpWc",
       authDomain: "kengarff-780c5.firebaseapp.com",
       databaseURL: "https://kengarff-780c5.firebaseio.com"*/

      apiKey: "AIzaSyBmHCwx19X8Vtxwxi9MJGMBGAXrHmXP9N8",
      authDomain: "customerdeliveriestv.firebaseapp.com",
      databaseURL: "https://customerdeliveriestv.firebaseio.com",
      storageBucket: "customerdeliveriestv.appspot.com",
      messagingSenderId: "778828163876"

    };

    firebase.initializeApp(config);

    var email = 'ajtest@cd.net';
    var password = 'password';

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
    });

    var ref;

    ref = firebase.database().ref().child('dealerships' );

    $scope.cities = $firebaseArray(ref);

    var latLng = new google.maps.LatLng(41.172486, -112.077810);

    var mapOptions = {
      center: latLng,
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    $scope.markers = [];

    var prev_infowindow =false;
    var bounds = new google.maps.LatLngBounds();


    $scope.addMarker = function(city){

      var latLng = new google.maps.LatLng(city.lat,city.lng);
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        label: city.dealerID
      });


      var myDate = new Date().getTime();
      var markerDate = new Date(city.timestamp).getTime();
      var difference = markerDate - myDate;

      //alert(city.dealerID + ' ' + Math.abs(Math.floor((difference/1000)/60)))

      if(Math.abs(Math.floor((difference/1000)/60)) > 5)
      {
        //has not reloaded for more than 5 minutes
       var infoWindow = new google.maps.InfoWindow({
          content: '<b>'  + city.dealerID + '</b><br>' + city.status + '<br><p style="color:red;">' + city.timestamp + '</p> ' +
            '<p>Battery: ' + city.battery +'</p><p>Plugged In: ' + city.pluggedIn +'</p>'
        });

      }else{
       var infoWindow = new google.maps.InfoWindow({
          content: '<b>'  + city.dealerID + '</b><br>' + city.status + '<br>' + city.timestamp + '</p> ' +
          '<p>Battery: ' + city.battery +'</p><p>Plugged In: ' + city.pluggedIn +'</p>'
        });
      }


      google.maps.event.addListener(marker, 'click', function () {
        if( prev_infowindow ) {
          prev_infowindow.close();
        }

        prev_infowindow = infoWindow;
        infoWindow.open($scope.map, marker);
      });

      $scope.markers.push(marker);

        bounds.extend(marker.position);
        $scope.map.fitBounds(bounds);
        $scope.map.setZoom($scope.map.getZoom() - 1);


    };


/*
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

/!*      for (i = 0; i < 3; i++){
        $scope.addMarker($scope.cities[i]);
      }*!/

      angular.forEach($scope.cities, function(data) {
        $scope.addMarker(data);

      });

    /!* var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });*!/

    });*/

setTimeout(function () {
  for (var i = 0; i < $scope.markers.length; i++) {
    $scope.markers[i].setMap(null);
  }
  $scope.markers = [];
  angular.forEach($scope.cities, function(data) {
    $scope.addMarker(data);
    $scope.lastUpdate = new Date();
  });
  $scope.lastUpdate = new Date();
},3000);


    setInterval(function(){
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(null);
      }
      $scope.markers = [];
      angular.forEach($scope.cities, function(data) {
        $scope.addMarker(data);

      });
      $scope.lastUpdate = new Date();
    },360000)


  });
