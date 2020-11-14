const review_form = document.getElementById("review-form");
const review_button = document.getElementById("review-form-submit");

// When the review button is clicked, the following code is executed
review_button.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();

    // Get the values input by the user in the form fields
    const location = review_form.location.value;
    const rating = review_form.rating.value;
    const comment = review_form.comment.value;

    const request = {
        query: location,
        fields: ['place_id'],
    };

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results.length > 0) {
                // Send a request to the server
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open('post', '/review');
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify({ 'place_id': results[0].place_id, 'rating': rating, 'comment': comment }));

                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        switch (xhr.status) {
                            case 200:
                                window.location = "/search?id=" + results[0].place_id;
                                break;
                            case 204:
                                window.location = "/login";
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
    });
});