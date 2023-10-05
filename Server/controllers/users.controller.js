const { fetchAPIUsers } = require("../models/users.model.js");

exports.getAPIUsers = (req, res, next) => {

    fetchAPIUsers()
    .then(users => res.status(200).send( { users } ))
    .catch(next)

};