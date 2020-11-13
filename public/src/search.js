const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const place_id = urlParams.get('id');

console.log(place_id);

var request = {
    placeId: place_id,
    fields: ['name', 'rating', 'formatted_address', 'formatted_phone_number']
};

const service = new google.maps.places.PlacesService(document.createElement('div'));
service.getDetails(request, (place, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById('name').innerHTML = place.name;
        document.getElementById('google-rating').innerHTML = place.rating;
        document.getElementById('address').innerHTML = place.formatted_address;
        document.getElementById('phone-number').innerHTML = place.formatted_phone_number;

        
    }
});