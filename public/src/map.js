let map;

function initMap() {
	const imageHome =
		"../res/images/maps/home.png";
	const imageGreen =
		"../res/images/maps/green.png";
	const imageYellow =
		"../res/images/maps/yellow.png";
	const imageRed =
		"../res/images/maps/red.png";
	const imageBlue =
		"../res/images/maps/blue.png";
	infoWindow = new google.maps.InfoWindow();

	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 15,
		mapTypeControl: false,
		streetViewControl: false,
		fullscreenControl: false,
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
						icon: imageHome,
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
				icon: imageHome,
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

			const marker = new google.maps.Marker({
				map,
				icon: imageBlue,
				title: place.name,
				position: place.geometry.location,
			});
			google.maps.event.addListener(marker, 'click', function (evt) { // the click event function is called with the "event" as an argument
				window.location = '/search?id=' + place.place_id
			});

			let infowindow = new google.maps.InfoWindow();
			marker.addListener('mouseover', function () {
				const xhr = new XMLHttpRequest();
				xhr.open('post', '/search', true);
				xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

				xhr.onload = () => {
					infowindow.open(map, marker);
					if (xhr.status == 200) {
						let reviews = JSON.parse(xhr.responseText).reviews;
						let total_rating = 0;

						for (let i = 0; i < reviews.length; ++i) {
							total_rating += reviews[i].rating;
						}

						infowindow.setContent("<div class='infowindow-container'><div class='inner'><h4>" + place.name +
							"</h4><p>Address: " + place.formatted_address + "</p><p>Covid Rating: " + (total_rating / reviews.length).toFixed(1) + "</p><p>Covid Reviews: " + reviews.length + "</p></div></div>");

					} else {
						infowindow.setContent("<div class='infowindow-container'><div class='inner'><h4>" + place.name +
							"</h4><p>Address: " + place.formatted_address + "</p></div></div>");
					}
				}

				xhr.send(JSON.stringify({ 'place_id': place.place_id }));
			});
			marker.addListener("mouseout", function () {
				infowindow.close();
			});

			markers.push(marker);

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