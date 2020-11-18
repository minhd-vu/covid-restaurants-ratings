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

        // Send a request to the server
        const xhr = new XMLHttpRequest();
        xhr.open('post', '/search', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

        xhr.onload = () => {
            if (xhr.status == 200) {
                let reviews = JSON.parse(xhr.responseText).reviews;
                let total_rating = 0;

                document.getElementById('comments').innerHTML = "";
                for (let i = 0; i < reviews.length; ++i) {
                    total_rating += reviews[i].rating;
                    document.getElementById('comments').innerHTML += "<p>User: " + reviews[i].user + " Rating: " + reviews[i].rating + " Comments: " + reviews[i].comment + "</p>";
                }

                document.getElementById('covid-rating').innerHTML = "Covid Rating: " + (total_rating / reviews.length).toFixed(1);

            } else {
                alert(xhr.responseText);
            }
        }

        xhr.send(JSON.stringify({ 'place_id': place_id }));
    }
});