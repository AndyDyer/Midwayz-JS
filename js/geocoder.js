// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete, autocomplete2;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
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
  function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
  }

function HTMLRequest(address, count){
  var geocode = new XMLHttpRequest();
  geocode = createCORSRequest('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDoSqElfTBYgl1sojUsbRYmRycvzSVZvPk');
  var tempLon= "lon" + count;
  var tempLat= "lat" + count;
  geocode.onload = function() {
    var geoData = JSON.parse(geocode.responseText); // parse the JSON from geocode response
    var results = geoData["results"]; // create variable for results
    var userLong = results[0]["geometry"]["location"]["lng"]; // parse the latitude
    var userLat = results[0]["geometry"]["location"]["lat"]; // parse the longitude
    console.log(userLong)
    console.log(userLat)
  }
  geocode.send();
}
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
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

function circleCenter(lat1,lon1, lat2, lon2){
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
  console.log(finLat)
  console.log(finLon)
}
function transition(){
  if(document.getElementById('autocomplete').value != null && document.getElementById('autocomplete2').value != null)
  {
    var temp = document.getElementById('autocomplete').value;
    HTMLRequest(temp, 1);

    temp = document.getElementById('autocomplete2').value;
    HTMLRequest(temp, 2);
  }
}
