const { fetchTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
 fetchTopics().then((response) => {
  res.status(200).send({ topics: response });
 });
};