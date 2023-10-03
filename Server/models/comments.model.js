const db = require("../../db/connection");

exports.fetchCommentsByArticleID = (article_id) => {

    return db.query(`SELECT * FROM comments WHERE article_ID = $1 ORDER BY created_at DESC;`, [article_id])
    .then( data => {
    
        if (data.rows.length === 0) {
            return Promise.reject( { status: 404, msg: "no article matching that ID found" } );
        }

        else return data.rows

    });

};