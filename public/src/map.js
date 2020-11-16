let map;

function initMap() {
  const imageHome =
    "../res/images/maps/home.png";
  const imageGreen =
    "../res/images/maps/green.png";
  infoWindow = new google.maps.InfoWindow();
  
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    mapTypeControl:false,
    streetViewControl:false,
    fullscreenControl:false,
  });
  
  service = new google.maps.places.PlacesService(map);
  
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(locationButton);
  locationButton.addEventListener("click", () => {
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          new google.maps.Marker({
            position: pos,
            map,
            icon:imageHome,
            title: "You!",
          });
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  
  
  //GMU Location
  const request = {
    query: "George Mason University",
    fields: ["name", "geometry"],
  };
  
  //Set Default location to GMU
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const marker = new google.maps.Marker({
        map,
        icon:imageHome,
        position: results[0].geometry.location,
      });
      google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name);
        infowindow.open(map);
      });
      map.setCenter(results[0].geometry.location);
    }
  });
  
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          //icon:imageGreen,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}