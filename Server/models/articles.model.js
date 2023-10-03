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

exports.fetchAllArticles = () => {

    const queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
    COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    return db.query(queryString).then( data => {
        return data.rows;
    });

};