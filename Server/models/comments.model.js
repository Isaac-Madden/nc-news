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

exports.addCommentByArticleID = (commentBody, article_ID, userName) => {

    return db.query(`INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`, [commentBody, article_ID, userName])
    .then( data => {
        return data.rows[0];
    })

};

exports.removeCommentByID = (comment_id) => {

    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
    .then( data => {

        if (data.rows.length === 0) {
        return Promise.reject( { status: 404, msg: "no comment matching that id found" } )
        }
    })
};