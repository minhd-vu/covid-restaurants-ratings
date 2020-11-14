const login_form = document.getElementById("login-form");
const login_button = document.getElementById("login-form-submit");

// When the login button is clicked, the following code is executed
login_button.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();

    // Get the values input by the user in the form fields
    const username = login_form.username.value;
    const password = login_form.password.value;

    // Send a request to the server
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('post', '/login');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.send(JSON.stringify({ 'user': username, 'password': password }));

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // User successfully logged in
                window.location = "/";
            } else {
                // Failed authentication
            }
        }
    }
})