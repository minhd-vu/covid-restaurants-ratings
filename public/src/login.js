const login_form = document.getElementById("login-form");
const login_button = document.getElementById("login-form-submit");
const authentication_alert = document.getElementById("authentication-alert");

// When the login button is clicked, the following code is executed
login_button.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();

    // Get the values input by the user in the form fields
    const username = login_form.username.value;
    const password = login_form.password.value;

    // Send a request to the server
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/login', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.send(JSON.stringify({ 'user': username, 'password': password }));

    xhr.onload = () => {
        switch (xhr.status) {
            case 200:
                window.location = "/";
                break;
            case 230:
                authentication_alert.innerHTML = xhr.responseText;
                authentication_alert.hidden = false;
                break;
            default:
                break;
        }
    }
})