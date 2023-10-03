const db = require("../../db/connection");

exports.fetchArticleByID = (article_id) => {

    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((data) => {

        if (data.rows.length === 0) {
         return Promise.reject({ status: 404, msg: "no article found" });
        }

        else return data.rows[0];
        
    });
};