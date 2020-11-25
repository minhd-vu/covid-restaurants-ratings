document.addEventListener("DOMContentLoaded", (e) => {
    const url = window.location.pathname;
    console.log(url);

    // Send a request to the server
    const xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    xhr.onload = () => {
        if (xhr.status == 200) {
            let reviews = JSON.parse(xhr.responseText).reviews;
            console.log(reviews);
        } else {
            alert(xhr.responseText);
        }
    }

    xhr.send();
}, false);