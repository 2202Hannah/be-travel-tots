const app = require(`../app.js`);
const request = require("supertest");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("Error handling", () => {
  test("404: responds with an error when passed a non existant end point", () => {
    return request(app)
      .get("/api/non-existant")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/types", () => {
  test("return status 200 when successful", () => {
    return request(app)
      .get("/api/types")
      .expect(200);
  });
  test("return an object with the expected values", () => {
    return request(app)
      .get("/api/types")
      .then(({ body }) => {
        const typesArray = body.types;
        expect(typesArray).toHaveLength(5);

        typesArray.forEach(type => {
          expect(type).toEqual(
            expect.objectContaining({
              type: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe("GET /api/places/:place_id", () => {
  test("return status 200 when successful", () => {
    return request(app)
      .get("/api/places/1")
      .expect(200);
  });
  test("return an object with the expected values for the place that has reviews", () => {
    return request(app)
      .get("/api/places/1")
      .then(({ body: place }) => {
        expect(place.place).toEqual(
          expect.objectContaining({
            place_id: 1,
            name: "Stretford Mall",
            type_of_place: "shopping centre",
            location: "Greater Manchester",
            address: "Chester Rd, Stretford, Manchester M32 9BD",
            review_count: 2,
            review_average: 3
          })
        );
      });
  });
  test("return an object with the expected values for the place that has 0 reviews", () => {
    return request(app)
      .get("/api/places/2")
      .then(({ body: place }) => {
        expect(place.place).toEqual(
          expect.objectContaining({
            place_id: 2,
            name: "Karen's Diner",
            type_of_place: "restaurant",
            location: "Greater Manchester",
            address: "Prestwich",
            review_count: 0,
            review_average: null
          })
        );
      });
  });
  test("400: responds with an error when passed a place_id of an incorrect type", () => {
    return request(app)
      .get("/api/places/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
  test("404: responds with an error when passed a place_id not present in our database", () => {
    return request(app)
      .get("/api/places/10")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("place_id not found in the database");
      });
  });
});

describe("GET /api/users", () => {
  test("return status 200 when successful", () => {
    return request(app)
      .get("/api/users")
      .expect(200);
  });
  test("return an object with the expected values for users", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const usersArray = body.users;
        expect(usersArray).toHaveLength(4);

        usersArray.forEach(user => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              email: expect.any(String),
              password: expect.any(String),
              profile_pic_url: expect.any(String),
              hometown: expect.any(String)
            })
          );
        });
      });
  });
});

describe("PATCH /api/places/:place_id", () => {
  test("200: returns status 200 and the updated object with updated votes amount when successful", () => {
    return request(app)
      .patch("/api/places/1")
      .expect(200)
      .send({ inc_votes: -5 })
      .then(({ body }) => {
        expect(body.place).toEqual(
          expect.objectContaining({
            place_id: 1,
            name: "Stretford Mall",
            type_of_place: "shopping centre",
            location: "Greater Manchester",
            address: "Chester Rd, Stretford, Manchester M32 9BD",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 0
          })
        );
      });
  });
  test("200: returns the place unchanged when passed an empty object", () => {
    return request(app)
      .patch("/api/places/1")
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.place).toEqual(
          expect.objectContaining({
            place_id: 1,
            name: "Stretford Mall",
            type_of_place: "shopping centre",
            location: "Greater Manchester",
            address: "Chester Rd, Stretford, Manchester M32 9BD",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 5
          })
        );
      });
  });
  test("400: responds with an error when passed a place_id of an incorrect type", () => {
    return request(app)
      .patch("/api/places/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
  test("400: responds with an error when passed a votes update that is an invalid type", () => {
    return request(app)
      .patch("/api/places/1")
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
  test("404: responds with an error when passed a place_id not present in our database", () => {
    return request(app)
      .patch("/api/places/100000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("place_id not found in the database");
      });
  });
});
