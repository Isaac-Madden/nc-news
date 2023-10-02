const app = require("../Server/app.js");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const request = require("supertest");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {

 test("Respond with a 200 status code", () => {
  return request(app).get("/api/topics").expect(200);
 });

 test("return array of topic objects with correct properties", () => {
  return request(app)
   .get("/api/topics")
   .then((data) => {
    expect(data.body.topics.length).toBe(3);
    data.body.topics.forEach((topic) => {
     expect(topic.hasOwnProperty('slug')).toBe(true);
     expect(topic.hasOwnProperty('description')).toBe(true);
    });
   });
 });

}); // end of "/api/topics" testing

describe("Invalid path", () => {

  test("Respond with a 404 status code", () => {
    return request(app).get("/api/thisshouldfail").expect(404);
  });

  test("should respond with invaid path error message", () => {
    return request(app)
    .get("/api/thisshouldfail")
    .then((data) => {
      expect(data.body.msg).toBe("invalid path");
    });
  });
}); // end of invalid path testing

