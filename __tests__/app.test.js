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

            expect(typeof article.author).toBe('string');
            expect(typeof article.title).toBe('string');
            expect(typeof article.article_id).toBe('number');
            expect(typeof article.topic).toBe('string');
            expect(typeof article.created_at).toBe('string');
            expect(typeof article.votes).toBe('number');
            expect(typeof article.article_img_url).toBe('string');
            expect(typeof article.comment_count).toBe('string');
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

describe("GET api/articles/:article_id/comments", () => {

  test("returns 200 status code if comment with matching article_id exists", () => {
    return request(app)
     .get("/api/articles/5/comments")
     .expect(200)
   })

  test("returns 404 and error message when unable to find comment with matching article_id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then( data => {
      expect(data.body.msg).toBe("no article matching that ID found");
    })
  })

  test("returns array containing an object representing every comment with matching article_id, sorted by created_at date", () => {
   return request(app)
      .get("/api/articles/1/comments")
      .then( data => {
      expect(data.body.comments.length).toBe(11);
      expect(data.body.comments).toBeSortedBy("created_at", { descending: true })
      })
  })

  test("each comment object within the array has correct properties", () => {
    return request(app)
     .get("/api/articles/9/comments")
     .then((data) => {
        data.body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe('number');
          expect(typeof comment.votes).toBe('number');
          expect(typeof comment.created_at).toBe('string');
          expect(typeof comment.author).toBe('string');
          expect(typeof comment.body).toBe('string');
          expect(comment.article_id).toBe(9);
        })
     })
   })

  test("error passed to handlers - returns 400 error and bad request message", () => {
   return request(app)
    .get("/api/articles/notanumber/comments")
    .expect(400)
    .then( data => {
     expect(data.body.msg).toBe("bad request");
    })
  })

}); // end of "GET api/articles/:article_id/comments" testing

describe("POST /api/articles/:article_id/comments", () => {

  test("responds with 201 status for successful requests", () => {

   return request(app)
    .post("/api/articles/5/comments")
    .send( {username: "butter_bridge", body: "this is a test"} )
    .expect(201)
  })

  test("responds with newly added comment", () => {

   return request(app)
    .post("/api/articles/5/comments")
    .send( {username: "icellusedkars", body: "also a test"} )
    .then( data => {
      expect(data.body.comment_added).toEqual(
        expect.objectContaining({
          comment_id: 19,
          body: "also a test",
          article_id: 5,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        })
      )
    })
  })

  test("error passed to handlers, responds with 404 when username violates foreign key constraint", () => {

    return request(app)
     .post("/api/articles/3/comments")
     .send( { username: "isaac", body: "this shouldn't work" } )
     .expect(404)
     .then( data => {
      expect(data.body.msg).toBe("not found");
     })

  })

  test("responds with 404 and error if key is not present in articles table", () => {

    return request(app)
      .post("/api/articles/999/comments")
      .send( {username: "icellusedkars", body: "also shouldn't work"} )
      .expect(404)
      .then( data => {
      expect(data.body.msg).toBe("not found");
      });
  })

  test("responds with 400 and error if username has not been defined", () => {

    return request(app)
    .post("/api/articles/5/comments")
    .send( {body: "this is a test"} )
    .expect(400)
    .then( data => {
      expect(data.body.msg).toBe("incomplete request, provide username")
   })
  })

  test("responds with 400 and error if body has not been defined", () => {

    return request(app)
    .post("/api/articles/5/comments")
    .send( {username: "icellusedkars"} )
    .expect(400)
    .then( data => {
      expect(data.body.msg).toBe("incomplete request, please add a comment")
   })
  })

}) // end of "POST /api/articles/:article_id/comments" testing

describe("PATCH: /api/articles/:article_id", () => {

  test("returns 202 status code following successful request", () => {

   return request(app)
    .patch("/api/articles/5")
    .send( { inc_votes: 35 } )
    .expect(202)
  })

  test("returns article with updated number of votes", () => {
    return request(app)
      .patch("/api/articles/9")
      .send( { inc_votes: 15 } )
      .then( data => {
        expect(data.body.article).toMatchObject({
          article_id: 9,
          title: "They're not exactly dogs, are they?",
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'Well? Think about it.',
          created_at: "2020-06-06T09:10:00.000Z",
          votes: 15,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      })
  })

  test("votes should still update when passed a negative number", () => {
    return request(app)
      .patch("/api/articles/9")
      .send( { inc_votes: -5 } )
      .then( data => {
        expect(data.body.article).toMatchObject({
          article_id: 9,
          title: "They're not exactly dogs, are they?",
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'Well? Think about it.',
          created_at: "2020-06-06T09:10:00.000Z",
          votes: -5,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      })
  })

  test("returns 400 and error when no votes object passed", () => {
    return request(app)
      .patch("/api/articles/9")
      .send()
      .expect(400)
      .then( data => {
        expect(data.body.msg).toBe("no votes submitted")
      })
  })

  test("return 404 and error if unable to match article_id", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send( { inc_votes: 25 } )
      .expect(404)
      .then( data => {
      expect(data.body.msg).toBe("no article found");
    })
  })

}) // end of "PATCH: /api/articles/:article_id" testing

describe("DELETE: /api/comments/:comment_id", () => {

  test("responds with 204 status, deletes the comment object", () => {
   return request(app)
    .delete("/api/comments/14")
    .expect(204)
    .then( () => {
      return request(app).get("/api/articles/5/comments")
        .then( data => {
          expect(data.body.comments).toEqual(
            [{
              "comment_id": 15,
              "body": "I am 100% sure that we're not completely sure.",
              "article_id": 5,
              "author": "butter_bridge",
              "votes": 1,
              "created_at": "2020-11-24T00:08:00.000Z"
            }]
          )
        })
    })
  })

  test("responds with 404 and error if no match found for comment_id", () => {
    return request(app)
     .delete("/api/comments/9999")
     .expect(404)
     .then( data => {
      expect(data.body.msg).toBe("no comment matching that id found");
     })
  })

  test("when passed invalid comment_id, error is passed to handler, 400 and error returned", () => {
    return request(app)
     .delete("/api/comments/notanumber")
     .expect(400)
     .then( data => {
      expect(data.body.msg).toBe("bad request");
     });
  })

}) // end of "DELETE: /api/comments/:comment_id" testing

describe("GET: /api/users", () => {

  test("responds with 200 status", () => {
   return request(app)
    .get("/api/users")
    .expect(200)
  })

  test("return array of users as objects, with username, name and avatar_url properties", () => {
    return request(app)
    .get("/api/users")
      .then( data => {
        expect(data.body.users.length).toBe(4)
        data.body.users.forEach( user => {
          expect(typeof user.username).toBe('string')
          expect(typeof user.name).toBe('string')
          expect(typeof user.avatar_url).toBe('string')
        })
      })
  })
}); // end of ""GET: /api/users" testing