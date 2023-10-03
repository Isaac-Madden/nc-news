const app = require("../Server/app.js");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const JSONendpoints = require("../endpoints.json");

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

describe("/api", () => {

  test("respond with 200 status code", () => {
   return request(app).get("/api").expect(200);
  });

  test("respond with object listing all available endpoints", () => {
    return request(app)
     .get("/api")
     .then((data) => {
      expect(data.body.fetchEndPoints).toEqual(JSONendpoints);
     });
   });

}); // end of "/api/topics" testing

describe("/api/articles/:article_id", () => {

  test("should respond with the correct status code", () => {
    return request(app).get("/api/articles/2").expect(200);
  })

  test("responds with article object with matching id", () => {
    return request(app)
     .get("/api/articles/7")
     .then(data => {
      expect(data.body.article).toEqual({
       article_id: 7,
       title: "Z",
       topic: "mitch",
       author: "icellusedkars",
       body: "I was hungry.",
       created_at: "2020-01-07T14:08:00.000Z",
       votes: 0,
       article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
     });
  });

  test("returns 404 error when valid id cannot be matched against article", () => {
  return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then((data) => {
    expect(data.body.msg).toBe("no article found");
    });
  });

  test("returns 400 error when id submitted is invalid", () => {
    return request(app)
     .get("/api/articles/abadrequest")
     .expect(400)
     .then((data) => {
      expect(data.body.msg).toBe("bad request");
     });
  });

 }); // end of "/api/articles/:article_id" testing

 describe("/api/articles", () => {

  test("returns correct status code and full array of 13 articles", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((data) => {
      expect(data.body.articles.length).toBe(13)
    })
  })

  test("articles returned are sorted in decending order by created_at property", () => {
    return request(app)
    .get("/api/articles")
    .then((data) => {
        expect(data.body.articles).toBeSortedBy("created_at", { descending: true });
    })
  })

  test("each article object needs specified properties. There should not be a body property", () => {
      return request(app)
      .get("/api/articles")
      .then((data) => {
          data.body.articles.forEach( (article) => {
              expect(article.hasOwnProperty('author')).toBe(true);
              expect(article.hasOwnProperty('title')).toBe(true);
              expect(article.hasOwnProperty('article_id')).toBe(true);
              expect(article.hasOwnProperty('topic')).toBe(true);
              expect(article.hasOwnProperty('created_at')).toBe(true);
              expect(article.hasOwnProperty('votes')).toBe(true);
              expect(article.hasOwnProperty('article_img_url')).toBe(true);
              expect(article.hasOwnProperty('comment_count')).toBe(true);
              expect(article.hasOwnProperty('body')).toBe(false);
          })
      })
  })

  test("error passed and 404 returned if path is not a route", () => {
      return request(app)
      .get('/api/thisshouldfail')
      .expect(404)
      .then((data) => {
          expect(data.body.msg).toBe('invalid path')
      })
  })

}) // end of "/api/articles" testing