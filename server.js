// ################ EXPRESS SERVER ################

const port = process.env.PORT || 3000;
const app = require("./app");

app.listen(port, () => {
    console.log("Server running on http://localhost:%s/", port);
});