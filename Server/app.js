const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { invalidPath, PSQLErrors, customErrors } = require("./controllers/errors.controller");
const { getAPIEndPoints } = require("./controllers/api.controller.js");
const { getArticleByID, getAllArticles, patchArticleByID } = require("./controllers/articles.controller.js")
const { getCommentsByArticleID, postCommentByArticleID, deleteCommentByID } = require("./controllers/comments.controller.js")


const app = express();
app.use(express.json());

//CORE routes
app.get("/api/topics", getTopics);
app.get("/api", getAPIEndPoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.post("/api/articles/:article_id/comments", postCommentByArticleID);
app.patch("/api/articles/:article_id", patchArticleByID);
app.delete("/api/comments/:comment_id", deleteCommentByID);


//error catchers
app.use(PSQLErrors);
app.use(customErrors);
app.use("/*", invalidPath);

module.exports = app;