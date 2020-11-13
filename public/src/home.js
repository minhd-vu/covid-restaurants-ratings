const search_box = document.getElementById('autocomplete');
const search_button = document.getElementById("search-button");

search_button.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();

    // Get the values input by the user in the form fields
    const request = {
        query: search_box.value,
        fields: ['place_id'],
    };

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results.length > 0) {
                window.location = '/search?id=' + results[0].place_id;
            }
        }
    });
});