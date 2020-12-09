// ################ JEST TESTS ################

const request = require("supertest");
const app = require("./app");

describe("Test the root path", () => {
    test("Responds to the GET method", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the login path", () => {
    test("Responds to the GET method", done => {
        request(app)
            .get("/login")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test("Test valid login", done => {
        request(app)
            .post("/login")
            .send({ user: 'Minh', password: 'password' })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test("Test invalid login", done => {
        request(app)
            .post("/login")
            .send({ user: 'asdfasdf', password: 'asdfasdf' })
            .then(response => {
                expect(response.statusCode).toBe(230);
                done();
            });
    });
});


describe("Test the review path", () => {
    test("Responds to the GET method before login", done => {
        request(app)
            .get("/review")
            .then(response => {
                expect(response.statusCode).toBe(302);
                done();
            });
    });
});

describe("Test the register path", () => {
    test("Responds to the GET method", done => {
        request(app)
            .get("/register")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test("Register an invalid user", done => {
        request(app)
            .post("/register")
            .send({ user: 'Minh', password: 'password' })
            .then(response => {
                expect(response.statusCode).toBe(230);
                done();
            });
    });
});

describe("Test the map path", () => {
    test("Responds to the GET method", done => {
        request(app)
            .get("/map")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("Test the search path", () => {
    test("Responds to the valid GET method", done => {
        request(app)
            .get("/search?id=ChIJWfhCVVett4kRIhKFzfi88wc")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test("Responds to the blank GET method", done => {
        request(app)
            .get("/search")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});