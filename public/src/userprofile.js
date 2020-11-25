const review_dom = document.getElementById("reviews");



const service = new google.maps.places.PlacesService(document.createElement('div'));


document.addEventListener("DOMContentLoaded", (e) => {
    const url = window.location.pathname;
    console.log(url);

    // Send a request to the server
    const xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    xhr.onload = () => {
        if (xhr.status == 200) {
            let data = JSON.parse(xhr.responseText);
            let reviews = data.reviews;
            console.log(reviews);
            document.getElementById("user-name").innerHTML = data.name;
            document.getElementById("number-of-reviews").innerHTML = reviews.length;
            review_dom.innerHTML = "";
            for (let i = 0; i < reviews.length; ++i) {
                var request = {
                    placeId: reviews[i].place_id,
                    fields: ['name']
                };

                service.getDetails(request, (place, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        review_dom.innerHTML += '<div class="user-review row"><div class="col-md-12" ><p><span>' + place.name + '</span></p></div><div class="col-md-12 review-col"><p class="rating-p"><span>' + reviews[i].rating + '</span> / 5.0</p></div><div class="col-md-12"><p>' + reviews[i].comment + '</p></div></div>';
                    }
                });
            }
        } else {
            alert(xhr.responseText);
        }
    }

    xhr.send();
}, false);