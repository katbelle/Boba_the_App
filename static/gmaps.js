// GMaps: get location

var map;
var userInfoWindow;
var pos;
var ShopData;


function nearbySearchCallback(results, status) {
  // console.log(results, status)
  results.forEach(function(result) {
    // console.log("result: ", result["name"])
    let lat = result["geometry"]["location"].lat()
    let lng = result["geometry"]["location"].lng()
    let bobaShopName = result["name"]
    $('p').append(bobaShopName + "  ")
    let marker = addMarker('static/imgs/boba.png', {lat: lat, lng: lng}, bobaShopName, map);
    let address = result["vicinity"]
    let placeId = result["place_id"]

    var ShopData = {
      placeId,
      address,
    }


    addInfoWindowToMarker(ShopData, marker, map);
  })
}

// look into turning off features of the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7886679, lng: -122.411499},
    zoom: 15
  });
  userInfoWindow = new google.maps.InfoWindow({map: map});


  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };


      // built in library function for nearbysearch instead of parsing json string from API call
      var service = new google.maps.places.PlacesService(map);
      // instead of using AJAX
      service.nearbySearch({
        location: pos,
        radius: 2000,
        type: ['cafe'],
        keyword: ['boba']
      }, nearbySearchCallback);


      userInfoWindow.setPosition(pos);
      userInfoWindow.setContent('You are here.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, userInfoWindow, map.getCenter());
    },
    {maximumAge: 600000, timeout: 5000, enableHighAccuracy: true});
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, userInfoWindow, map.getCenter());
  }
}


function addMarker(icon, position, title, map) {
  const marker = new google.maps.Marker({ position, map, title, icon });

  return marker;
}

function addInfoWindowToMarker(ShopData, marker, map) {
  marker.addListener('click', () => {

    var detailsRequest = {
      placeId: ShopData.placeId,
      fields: ['photos', 'photo', 'rating', 'formatted_phone_number']
    };

    var service = new google.maps.places.PlacesService(map);
    service.getDetails(detailsRequest, (place, status) => {
      console.log(place)
      var url = place.photos[3].getUrl({'maxWidth': 250, 'maxHeight': 200})
      const aboutLocation = `
        <h1>${marker.title}</h1>
        <p> <img src=${url}> </img> </p>
        <ul>
          <li><b>Address:</b> ${ShopData.address}</li>
          <li><b>Phone:</b> ${place.formatted_phone_number}</li>
        </ul>
      `;
      console.log("mekkin window", aboutLocation)

      const infoWindow = new google.maps.InfoWindow({
        content: aboutLocation,
        maxWidth: 500
      }, );
      console.log("opening winnow")
      infoWindow.open(map, marker)

    })

   });
}


function handleLocationError(browserHasGeolocation, userInfoWindow, pos) {
  userInfoWindow.setPosition(pos);
  userInfoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}