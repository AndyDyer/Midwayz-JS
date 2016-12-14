// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete, autocomplete2, bounds, map;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  bounds = new google.maps.LatLngBounds();
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});
  autocomplete2 = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete2')),
      {types: ['geocode']});
  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  //autocomplete.addListener('place_changed');
}
function changeButton(){
  if(document.getElementById("autocomplete").value != "" && document.getElementById("autocomplete2").value != "")
  {
    document.getElementById("goTime").style.backgroundColor = "#4cc6d4";
    document.getElementById("goTime").style.color = "black";
  }
}
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

function circleCenter(lat1,lon1, lat2, lon2, resultsMap){
  var rLat1 = lat1 * (Math.PI/180);
  var rLat2 = lat2 * (Math.PI/180);
  var rLon1 = lon1 * (Math.PI/180);
  var dLon = (lon2-lon1) * (Math.PI/180);
  var Bx = Math.cos(rLat2) * Math.cos(dLon);
  var By = Math.cos(rLat2) * Math.sin(dLon);

  var finLat = Math.atan2((Math.sin(rLat1) +Math.sin(rLat2)), Math.sqrt((Math.cos(rLat1) + Bx)*(Math.cos(rLat1) + Bx) +By*By))
  var finLon = rLon1 + Math.atan2(By,Math.cos(rLat1) +Bx)
  //radians * (180/pi)
  finLat = finLat * (180/Math.PI)
  finLon = finLon * (180/Math.PI)
  var myLatLng = {lat: finLat, lng: finLon};
  var icon = {
    url: "img/tag1.png", // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(50, 50) // anchor
};
  var marker = new google.maps.Marker({
    map: resultsMap,
    position: myLatLng,
    icon: icon
  });
  loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
  bounds.extend(loc);
  resultsMap.fitBounds(bounds);
}

function initMap() {
  var geocoder = new google.maps.Geocoder(); // PUT THIS IN INIT FX
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.828175, lng: -98.5795},
    zoom: 6,
    styles: [
        {elementType: 'geometry', stylers: [{color: '#F8F8F8'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#FEFEFE'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#000'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#1A1717'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#a0d370'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#1A1717'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#4e5259'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#FFF'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#1A1717'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#40B7C9'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#1A1717'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#ffffff'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#1A1717'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#A9DFE6'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#1A1717'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#FEFEFE'}]
        }
      ]
  });
  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
    geocodeAddress(geocoder,map)
    geocodeAddressB(geocoder,map)
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  //map.addListener('idle', performSearch);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function geocodeAddress(geocoder, resultsMap) {
      var address = document.getElementById('autocomplete').value; // CHANGE THIS BOYO
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
          resultsMap.setCenter(results[0].geometry.location);
          console.log(results[0].geometry.location.lat());
          printLatLong(results[0].geometry.location.lat(),results[0].geometry.location.lng());
          var icon1 = {
            url: "img/placeMark.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(50, 50) // anchor
          };
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location,
            icon: icon1
          });
          loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
          bounds.extend(loc);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

function geocodeAddressB(geocoder, resultsMap) {
      var address = document.getElementById('autocomplete2').value; // CHANGE THIS BOYO
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
          resultsMap.setCenter(results[0].geometry.location);
          printLatLong2(results[0].geometry.location.lat(),results[0].geometry.location.lng())
          var icon2 = {
            url: "img/placeMark.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(50, 50) // anchor
        };
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location,
            icon: icon2
          });
          loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
          bounds.extend(loc);
          circleCenter(ly,lny,lx,lnx,resultsMap)
          resultsMap.setZoom(15)
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

function performSearch() {
        var request = {
          bounds: map.getBounds(),
          keyword: 'food'
        };
        service.radarSearch(request, callback);
}

function callback(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        for (var i = 0, result; result = results[i]; i++) {
          addMarker(result);
        }
}

function addMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: {
            url: "img/poi.png",
            scaledSize: new google.maps.Size(30, 30)
          }
          //url: "maps.google.com/?q" + place.names

        });


        google.maps.event.addListener(marker, 'click', function() {
          service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.error(status);
              return;
            }
            var fill = result.formatted_address
            fill = fill.replace(" ", "+")
            fill = fill.replace(" ", "+")
            fill = fill.replace(" ", "+")
            fill = fill.replace(" ", "+")
            var temp = "http://www.maps.google.com/?q=" + result.name +"+" + fill
            console.log(fill)
             var contentString = "<a href=" +temp + "id=filltext>" + result.name + "</a>"
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
          });
        });
      }

function transition(){
  if(document.getElementById("autocomplete").value != "" && document.getElementById("autocomplete2").value != "")
  {
  //CSS Transitions
  document.getElementById("enter").style.display = "none";
  document.getElementById("enter2").style.display ="none";
  document.getElementById("goTime").style.display= "none";
  document.getElementById("tempText").style.display="none";
  console.log(document.getElementById("autocomplete").value);
  console.log(document.getElementById("autocomplete2").value);

  //JS calls
  initMap();
  }
}
var ly,lny,lx,lnx
function printLatLong(lat1, long1){
  ly = lat1
  lny = long1
  console.log(ly)
}
function printLatLong2(lat1,long1)
{
  lx = lat1
  lnx = long1
}
