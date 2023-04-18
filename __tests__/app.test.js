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
  test("return an object with the expected values for the place", () => {
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
