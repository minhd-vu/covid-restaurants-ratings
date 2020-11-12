let autocomplete;

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocomplete"),
        { types: ["establishment"] }
    );
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(["address_component"]);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            const circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy,
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

const search_button = document.getElementById("search-button");

search_button.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();

    // Get the values input by the user in the form fields
    const place = autocomplete.value;
    console.log(place);

    $.getJSON('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyA6eTXkehQYkqfOyJD_W8HIzW9oMFbmUv0', (data) => {
        console.log(data);
    });

    // var request = {
    //     query: 'Museum of Contemporary Art Australia',
    //     fields: ['name', 'place_id'],
    // };

    // var service = new google.maps.places.PlacesService();

    // service.findPlaceFromQuery(request, (results, status) => {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         console.log(result[0]);
    //         results[0].place_id;
    //     }
    // });

    // Send a request to the server
    /* const request = new XMLHttpRequest();
    request.open('post', '/search');
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    request.send(JSON.stringify({ 'place': place }));

    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status == 200) {

                window.location = "/";
            } else {

            }
        }
    } */
})