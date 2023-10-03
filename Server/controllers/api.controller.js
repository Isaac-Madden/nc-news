const fetchEndPoints = require("../../endpoints.json");

exports.getAPIEndPoints = (req, res, next) => {
    res.status(200).send({ fetchEndPoints });
};