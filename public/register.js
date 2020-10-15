const register_form = document.getElementById("register-form");
const register_button = document.getElementById("register-form-submit");

// When the register button is clicked, the following code is executed
register_button.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();

    // Get the values input by the user in the form fields
    const username = register_form.username.value;
    const password = register_form.password.value;
    const confirm_password = register_form.confirm_password.value;

    if (!username || !password || !confirm_password) {
        alert("Please fill in all fields.");
    } else if (password != confirm_password) {
        alert("Passwords do not match.");
    }

    // Send a request to the server
    const request = new XMLHttpRequest();
    request.open('post', '/register');
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    request.send(JSON.stringify({ 'user': username, 'password': password }));
})