const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { invalidPath, PSQLErrors, customErrors } = require("./controllers/errors.controller");
const { getAPIEndPoints } = require("./controllers/api.controller.js");
const { getArticleByID, getAllArticles } = require("./controllers/articles.controller.js")

const app = express();
app.use(express.json());

//CORE routes
app.get("/api/topics", getTopics);
app.get("/api", getAPIEndPoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getAllArticles);

//error catchers
app.use(PSQLErrors);
app.use(customErrors);
app.use("/*", invalidPath);

module.exports = app;