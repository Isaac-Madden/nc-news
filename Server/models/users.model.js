const db = require("../../db/connection");

exports.fetchAPIUsers = () => {

    return db.query(`SELECT * FROM users`)
    .then( data => {

        if (data.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "no users found" })
        }
        else return data.rows
        
    });
};