const register_form = document.getElementById("register-form");
const register_button = document.getElementById("register-form-submit");
const authentication_alert = document.getElementById("authentication-alert");

// When the register button is clicked, the following code is executed
register_button.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();

    // Get the values input by the user in the form fields
    const username = register_form.username.value;
    const password = register_form.password.value;
    const confirm_password = register_form.confirm_password.value;

    if (!username || !password || !confirm_password) {
        authentication_alert.innerHTML = "Field(s) cannot be blank."
        authentication_alert.hidden = false;
    } else if (password != confirm_password) {
        authentication_alert.innerHTML = "Passwords do not match."
        authentication_alert.hidden = false;
    } else {
        // Send a POST request to the server
        const xhr = new XMLHttpRequest();
        xhr.open('post', '/register', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhr.send(JSON.stringify({ 'user': username, 'password': password }));

        xhr.onload = () => {
            switch (xhr.status) {
                case 200:
                    window.location = "/login";
                    break;
                case 230:
                    authentication_alert.innerHTML = xhr.responseText;
                    authentication_alert.hidden = false;
                default:
                    break;
            }
        }
    }
});