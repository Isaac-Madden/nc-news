const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { invalidPath } = require("./controllers/errors.controller");

const app = express();
app.use(express.json());

//CORE: GET /api/topics
app.get("/api/topics", getTopics);

//catch invalid path - anything other than listed above
app.use("/*", invalidPath);

module.exports = app;