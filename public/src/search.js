const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const place_id = urlParams.get('id');

console.log(place_id);

var request = {
    placeId: place_id,
    fields: ['name', 'rating', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'website']
};

var renderStars = function (rating) {
    var stars = '<div class="review-stars"><ul>';
    // fills gold stars
    for (var i = 0; i < rating; i++) {
        stars += '<li><i class="star"></i></li>';
    }
    // fills empty stars
    if (rating < 5) {
        for (var i = 0; i < (5 - rating); i++) {
            stars += '<li><i class="star inactive"></i></li>';
        }
    }
    stars += "</ul></div>";
    return stars;
};

const service = new google.maps.places.PlacesService(document.createElement('div'));

service.getDetails(request, (place, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById('name').innerHTML = place.name;
        document.getElementById('google-rating').innerHTML = place.rating;
        document.getElementById('address').innerHTML = place.formatted_address;
        document.getElementById('phone-number').innerHTML = place.formatted_phone_number;
        document.getElementById('opening-hours').innerHTML = place.opening_hours.weekday_text;
        document.getElementById('url').innerHTML = place.website;

        // Send a request to the server
        const xhr = new XMLHttpRequest();
        xhr.open('post', '/search', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

        xhr.onload = () => {
            if (xhr.status == 200) {
                let reviews = JSON.parse(xhr.responseText).reviews;
                let total_rating = 0;
                let html = "<h3>Covid Reviews</h3>";

                for (let i = 0; i < reviews.length; ++i) {
                    total_rating += reviews[i].rating;
                    // document.getElementById('comments').innerHTML += "<p>User: " + reviews[i].user + " Rating: " + reviews[i].rating + " Comments: " + reviews[i].comment + "</p>";
                    // let style = (reviews[i].comment.length > parseInt(settings.textBreakLength)) ? "review-item-long" : "review-item";
                    html += "<div class=" + "review-item" + "><div class='review-header'><div class='review-usergrade'><div class='review-meta'><span class='review-author'>" + reviews[i].user + "</span><span class='review-sep'></span>" + "<br><span class='review-date'>" + "date" + "</span>" + "</div>" + renderStars(reviews[i].rating) + "</div></div><p class='review-text'>" + reviews[i].comment + "</p></div>";

                }

                document.getElementById('covid-reviews').innerHTML = html;
                document.getElementById('covid-rating').innerHTML = "Covid Rating: " + (total_rating / reviews.length).toFixed(1);

            } else {
                alert(xhr.responseText);
            }
        }

        xhr.send(JSON.stringify({ 'place_id': place_id }));
    }
    console.log("request", request);
});